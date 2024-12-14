import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';
import { Forecast, ForecastState, WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TextCarouselComponent],
  providers: [WeatherDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WeatherEnvitia';
  dataSub: Subscription;
  forecast: Forecast;
  forecastDays: Array<string> = [];

  constructor(
    protected data: WeatherDataService, 
    protected cd: ChangeDetectorRef
  ){

  }

  ngOnInit(): void {
    this.data.getForecast();
    this.dataSub = this.data.forecast$.subscribe(
      (state: ForecastState) => {
        this.forecast = state.forecast;
        this.forecastDays = [...Object.keys(this.forecast)];
        this.cd.detectChanges();
        console.log(this.forecastDays);
      } 
    )
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
