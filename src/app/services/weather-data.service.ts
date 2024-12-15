import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { finalize, map, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { WmoIconMapping } from './sys-data.service';

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
type HourForecast = Array<{
  time: string,
  hourlyWmoCode: number
}>;
export type DayForecast = {
  dailyWmoCode: number
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
const api_url: string = "https://api.open-meteo.com/v1/forecast?daily=weather_code&hourly=weather_code&forecast_days=5&timezone=UTC";

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
        map((forecastRes: HttpResponse<ForecastResponse>) => {
          let forecast: Forecast = {};
          forecastRes.body?.daily?.time.forEach((day: string, i: number) => {
            //build dictionary of days in forecase, with top-level summary weather code
            let weatherCode: number = Number(forecastRes.body?.daily?.weather_code[i]);
            forecast[day] = { dailyWmoCode: weatherCode, hours: []};

            //select the 24 hourly times + weathercodes from full forecast using day index
            //- day 0 => daily indexes 0-23 
            //- day 3 => daily indexes  48-71 
            let hoursTimes: Array<string> = forecastRes.body?.hourly.time.filter((val, j) => j >= (i*24) && j < ((i*24)+24));
            let hoursData:  Array<number> = forecastRes.body?.hourly.weather_code.filter((val, j) => j >= (i*24) && j < ((i*24)+24));
            hoursTimes?.forEach((time, k) => {
              forecast[day].hours.push({ time: time.split("T")[1], hourlyWmoCode: Number(hoursData?.[k]) });
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
          console.log(state);
          this.forecast$.next(state);
        },
        error: err => { 
          this.forecast$.next({error: err})
        }
      }) 
  }
}
