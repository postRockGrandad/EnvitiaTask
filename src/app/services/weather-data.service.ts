import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { finalize, map, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

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
  // https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
  public WmoMappings: WmoIconMapping = {
    "0":{
      "day":{
        "description":"Sunny",
        "image":"http://openweathermap.org/img/wn/01d@2x.png"
      },
      "night":{
        "description":"Clear",
        "image":"http://openweathermap.org/img/wn/01n@2x.png"
      }
    },
    "1":{
      "day":{
        "description":"Mainly Sunny",
        "image":"http://openweathermap.org/img/wn/01d@2x.png"
      },
      "night":{
        "description":"Mainly Clear",
        "image":"http://openweathermap.org/img/wn/01n@2x.png"
      }
    },
    "2":{
      "day":{
        "description":"Partly Cloudy",
        "image":"http://openweathermap.org/img/wn/02d@2x.png"
      },
      "night":{
        "description":"Partly Cloudy",
        "image":"http://openweathermap.org/img/wn/02n@2x.png"
      }
    },
    "3":{
      "day":{
        "description":"Cloudy",
        "image":"http://openweathermap.org/img/wn/03d@2x.png"
      },
      "night":{
        "description":"Cloudy",
        "image":"http://openweathermap.org/img/wn/03n@2x.png"
      }
    },
    "45":{
      "day":{
        "description":"Foggy",
        "image":"http://openweathermap.org/img/wn/50d@2x.png"
      },
      "night":{
        "description":"Foggy",
        "image":"http://openweathermap.org/img/wn/50n@2x.png"
      }
    },
    "48":{
      "day":{
        "description":"Rime Fog",
        "image":"http://openweathermap.org/img/wn/50d@2x.png"
      },
      "night":{
        "description":"Rime Fog",
        "image":"http://openweathermap.org/img/wn/50n@2x.png"
      }
    },
    "51":{
      "day":{
        "description":"Light Drizzle",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Light Drizzle",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "53":{
      "day":{
        "description":"Drizzle",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Drizzle",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "55":{
      "day":{
        "description":"Heavy Drizzle",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Heavy Drizzle",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "56":{
      "day":{
        "description":"Light Freezing Drizzle",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Light Freezing Drizzle",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "57":{
      "day":{
        "description":"Freezing Drizzle",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Freezing Drizzle",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "61":{
      "day":{
        "description":"Light Rain",
        "image":"http://openweathermap.org/img/wn/10d@2x.png"
      },
      "night":{
        "description":"Light Rain",
        "image":"http://openweathermap.org/img/wn/10n@2x.png"
      }
    },
    "63":{
      "day":{
        "description":"Rain",
        "image":"http://openweathermap.org/img/wn/10d@2x.png"
      },
      "night":{
        "description":"Rain",
        "image":"http://openweathermap.org/img/wn/10n@2x.png"
      }
    },
    "65":{
      "day":{
        "description":"Heavy Rain",
        "image":"http://openweathermap.org/img/wn/10d@2x.png"
      },
      "night":{
        "description":"Heavy Rain",
        "image":"http://openweathermap.org/img/wn/10n@2x.png"
      }
    },
    "66":{
      "day":{
        "description":"Light Freezing Rain",
        "image":"http://openweathermap.org/img/wn/10d@2x.png"
      },
      "night":{
        "description":"Light Freezing Rain",
        "image":"http://openweathermap.org/img/wn/10n@2x.png"
      }
    },
    "67":{
      "day":{
        "description":"Freezing Rain",
        "image":"http://openweathermap.org/img/wn/10d@2x.png"
      },
      "night":{
        "description":"Freezing Rain",
        "image":"http://openweathermap.org/img/wn/10n@2x.png"
      }
    },
    "71":{
      "day":{
        "description":"Light Snow",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Light Snow",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "73":{
      "day":{
        "description":"Snow",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Snow",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "75":{
      "day":{
        "description":"Heavy Snow",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Heavy Snow",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "77":{
      "day":{
        "description":"Snow Grains",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Snow Grains",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "80":{
      "day":{
        "description":"Light Showers",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Light Showers",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "81":{
      "day":{
        "description":"Showers",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Showers",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "82":{
      "day":{
        "description":"Heavy Showers",
        "image":"http://openweathermap.org/img/wn/09d@2x.png"
      },
      "night":{
        "description":"Heavy Showers",
        "image":"http://openweathermap.org/img/wn/09n@2x.png"
      }
    },
    "85":{
      "day":{
        "description":"Light Snow Showers",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Light Snow Showers",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "86":{
      "day":{
        "description":"Snow Showers",
        "image":"http://openweathermap.org/img/wn/13d@2x.png"
      },
      "night":{
        "description":"Snow Showers",
        "image":"http://openweathermap.org/img/wn/13n@2x.png"
      }
    },
    "95":{
      "day":{
        "description":"Thunderstorm",
        "image":"http://openweathermap.org/img/wn/11d@2x.png"
      },
      "night":{
        "description":"Thunderstorm",
        "image":"http://openweathermap.org/img/wn/11n@2x.png"
      }
    },
    "96":{
      "day":{
        "description":"Light Thunderstorms With Hail",
        "image":"http://openweathermap.org/img/wn/11d@2x.png"
      },
      "night":{
        "description":"Light Thunderstorms With Hail",
        "image":"http://openweathermap.org/img/wn/11n@2x.png"
      }
    },
    "99":{
      "day":{
        "description":"Thunderstorm With Hail",
        "image":"http://openweathermap.org/img/wn/11d@2x.png"
      },
      "night":{
        "description":"Thunderstorm With Hail",
        "image":"http://openweathermap.org/img/wn/11n@2x.png"
      }
    }
  };

  constructor(
    private api: ApiService,
    // private sysData: SysDataService
  ) {
    
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
          console.log(state);
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
