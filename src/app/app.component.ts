import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';
import { Forecast, ForecastState, DayForecast, WeatherDataService } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { WmoIconMapping } from './services/sys-data.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TabNavigationComponent } from './components/tab-navigation/tab-navigation.component';
import { DisplayDatePipe } from './pipes/display-date.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TextCarouselComponent, TabNavigationComponent, NgbNavModule, DisplayDatePipe],
  providers: [WeatherDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('dailyWeather') dailyWeatherTemp: TemplateRef<any>;
  @ViewChild('dailyPrecipitation') dailyPrecipitationTemp: TemplateRef<any>;
  @ViewChild('dailyWind') dailyWindTemp: TemplateRef<any>;
  dataSub: Subscription;
  forecast: Forecast;
  forecastDays: Array<string> = [];
  wmoMappings: WmoIconMapping;
  selectedDayForecast: DayForecast

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
        this.selectedDayForecast = this.forecast[Object.keys(this.forecast)[0]];

        console.log(this.forecastDays, this.forecast);
      } 
    )
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
