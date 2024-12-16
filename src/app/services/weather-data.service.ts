import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { finalize, map, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { wmoIconMappings } from '../static-data/wmoIconMappings';

export type WmoIconMapping = {
  [key in number]: {
    day: {
      description: string,
      image: string
    }, 
    night: {
      description: string,
      image: string
    }
  }
};
type ForecastResponse = {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  daily?: {
    time: Array<string>,
    weather_code: Array<number>,
    temperature_2m_max: Array<number>,
    temperature_2m_min: Array<number>,
  },
  daily_units: {
    time: string,
    weather_code: number
  },
  hourly: {
    time: Array<string>,
    weather_code: Array<number>
    temperature_2m: Array<number>,
    precipitation: Array<number>
    wind_speed_10m: Array<number>,
    wind_direction_10m: Array<number>
  },
  hourly_units:  {
    time: string,
    weather_code: number
  }
}
type HourForecast = Array<{
  time: string,
  hourlyWmoCode: number,
  hourlyTemp: number,
  hourlyPrecip: number,
  hourlyWindSpeed: number,
  hourlyWindDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
}>;
export type DayForecast = {
  date: string,
  dailyWmoCode: number,
  dailyMax: number,
  dailyMin: number,
  hours: HourForecast 
}
export type Forecast = {
  [key in string]: DayForecast
};
export type ForecastState = {
  forecast?: Forecast,
  error?: string,
  warning?: string
}
const api_url: string = "https://api.open-meteo.com/v1/forecast?daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=weather_code,wind_speed_10m,wind_direction_10m,temperature_2m,precipitation&forecast_days=5&timezone=UTC";

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  public forecast$: Subject<ForecastState> = new Subject();
  public readonly _WmoMappings: WmoIconMapping;

  constructor(
    private api: ApiService
  ) {
    this._WmoMappings = {};
    Object.assign(this._WmoMappings, wmoIconMappings);
   }

  public getForecast(latitude: number, longitude: number): void {
    let sub = this.api.getUrl<ForecastResponse>(api_url + "&latitude="+latitude+"&longitude="+longitude)
      .pipe(
        map(this.deserializeForecast),
        finalize(()=>{ sub.unsubscribe(); })
      )
      .subscribe({
        next: (forecast: Forecast) => {
          let state: ForecastState = { forecast: forecast };
          if(Object.keys(forecast).length === 0){
            state.warning = "No data found";
          };
          
          this.forecast$.next(state);
        },
        error: err => { 
          this.forecast$.next({error: err})
        }
      }) 
  }

  private deserializeForecast(forecastRes: HttpResponse<ForecastResponse>): Forecast {
    function angleToCompass(angle: number): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
      var directions: Array<'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'> = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
      return directions[index];
    }

    let forecast: Forecast = {};
    forecastRes.body?.daily?.time.forEach((day: string, dayInForecast: number) => {
      //build dictionary of days in forecase, with top-level summary weather code
      let weatherCode: number = Number(forecastRes.body?.daily?.weather_code[dayInForecast]);
      let tempMin: number = Number(forecastRes.body?.daily?.temperature_2m_min[dayInForecast]);
      let tempMax: number = Number(forecastRes.body?.daily?.temperature_2m_max[dayInForecast]);
      //select the 24 hourly times + weathercodes from full forecast using day index
      //- day 0 => daily indexes 0-23 
      //- day 3 => daily indexes  48-71 
      function filterHoursByDayPosition<T>(value: T, index: number) { return index >= (dayInForecast*24) && index < ((dayInForecast*24)+24) }
      let hoursTimes: Array<string> = forecastRes.body?.hourly.time.filter(filterHoursByDayPosition<string>);
      let hoursWeatherData:  Array<number> = forecastRes.body?.hourly.weather_code.filter(filterHoursByDayPosition<number>);
      let hoursTempData:  Array<number> = forecastRes.body?.hourly.temperature_2m.filter(filterHoursByDayPosition<number>);
      let hoursPrecipData:  Array<number> = forecastRes.body?.hourly.precipitation.filter(filterHoursByDayPosition<number>);
      let hoursWindSpeedData:  Array<number> = forecastRes.body?.hourly.wind_speed_10m.filter(filterHoursByDayPosition<number>);
      let hoursWindDirectionData:  Array<number> = forecastRes.body?.hourly.wind_direction_10m.filter(filterHoursByDayPosition<number>);

      forecast[day] = { 
        date: day,
        dailyWmoCode: weatherCode, 
        dailyMin: tempMin,
        dailyMax: tempMax,
        hours: []
      };
      hoursTimes?.forEach((time, k) => {
        forecast[day].hours.push({ 
          time: time.split("T")[1], 
          hourlyWmoCode: Number(hoursWeatherData?.[k]), 
          hourlyTemp: Number(hoursTempData?.[k]),
          hourlyPrecip: Number(hoursPrecipData?.[k]) * 10,
          hourlyWindSpeed: Number(hoursWindSpeedData?.[k]),
          hourlyWindDirection: angleToCompass(Number(hoursWindDirectionData?.[k]))
        });
      });

    });
    return forecast;
  }
}
