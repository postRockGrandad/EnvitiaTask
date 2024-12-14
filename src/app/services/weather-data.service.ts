import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { finalize, map, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

const api_url: string = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code&hourly=weather_code&forecast_days=5&timezone=UTC";
export type ForecastResponse = {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  daily?: {
    time: Array<string>,
    weather_code: Array<number>
  },
  daily_units: {
    time: string,
    weather_code: number
  },
  hourly: {
    time: Array<string>,
    weather_code: Array<number>
  },
  hourly_units:  {
    time: string,
    weather_code: number
  }
}
export type HoursForecast = {
  [key in string]: {
    hourlyWmoCode: number
  }
};
export type Forecast = {
  [key in string]: {
    dailyWmoCode: number
    hours: HoursForecast 
  }
};

export type ForecastState = {
  forecast?: Forecast,
  error?: string,
  warning?: string
}

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  public forecast$: Subject<ForecastState> = new Subject();

  constructor(private api: ApiService) { }

  public getForecast() {
    let sub = this.api.getUrl<ForecastResponse>(api_url)
      .pipe(
        map((forecastRes: HttpResponse<ForecastResponse>) => {
          let forecast: Forecast = {};
          forecastRes.body?.daily?.time.forEach((day: string, i: number) => {
            //build dictionary of days in forecase, with top-level summary weather code
            let weatherCode: number = Number(forecastRes.body?.daily?.weather_code[i]);
            forecast[day] = { dailyWmoCode: weatherCode, hours: {}};

            //select the 24 hourly times + weathercodes from full forecast using day index
            //- day 0 => daily indexes 0-23 
            //- day 3 => daily indexes  48-71 
            let hoursTimes: Array<string> = forecastRes.body?.hourly.time.filter((val, j) => j >= (i*24) && j < ((i*24)+24));
            let hoursData:  Array<number> = forecastRes.body?.hourly.weather_code.filter((val, j) => j >= (i*24) && j < ((i*24)+24));
            hoursTimes?.forEach((time, k) => {
              forecast[day].hours[time.split("T")[1]] = { hourlyWmoCode: Number(hoursData?.[k]) };
            });
          });
          return forecast;
        }),
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
}
