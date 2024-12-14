import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';
import { Forecast, ForecastState, WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { WmoIconMapping } from './services/sys-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TextCarouselComponent],
  providers: [WeatherDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WeatherEnvitia';
  dataSub: Subscription;
  forecast: Forecast;
  forecastDays: Array<string> = [];
  wmoMappings: WmoIconMapping;

  constructor(
    protected data: WeatherDataService, 
    protected cd: ChangeDetectorRef
  ){

  }

  ngOnInit(): void {
    this.wmoMappings = this.data.WmoMappings;

    this.data.getForecast();
    this.dataSub = this.data.forecast$.subscribe(
      (state: ForecastState) => {
        this.forecast = state.forecast;
        this.forecastDays = [...Object.keys(this.forecast)];
        console.log(this.forecastDays);
            
        console.log(this.wmoMappings[0].day.description)
        // this.cd.detectChanges();

      } 
    )
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
