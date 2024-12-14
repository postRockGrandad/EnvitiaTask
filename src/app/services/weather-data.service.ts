import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { finalize } from 'rxjs';

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
  daily_units?: {
    time: string,
    weather_code: number
  },
  hourly?: {
    time: Array<string>,
    weathercode: Array<number>
  },
  hourly_units?:  {
    time: string,
    weathercode: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  
  constructor(private api: ApiService) { }

  public getForecast() {
    let sub = this.api.getUrl<ForecastResponse>(api_url)
      .pipe(
        finalize(()=>{ sub.unsubscribe(); })
      )
      .subscribe({
        next: res => {
          console.log(res.body);
        },
        error: err => { /*TODO*/ }
      }) 
  }
}
