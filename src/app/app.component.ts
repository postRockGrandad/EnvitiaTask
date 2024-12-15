import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';
import { Forecast, ForecastState, DayForecast, WeatherDataService, WmoIconMapping } from './services/weather-data.service';
import { Subscription } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TabNavigationComponent } from './components/tab-navigation/tab-navigation.component';
import { DisplayDatePipe } from './pipes/display-date.pipe';
import { ForecastSearchFormComponent } from './components/forecast-search-form/forecast-search-form.component';
import { DisplayTempPipe } from './pipes/display-temp.pipe';
import { PrecipitationGraphComponent } from './components/precipitation-graph/precipitation-graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, PrecipitationGraphComponent, TextCarouselComponent, TabNavigationComponent, ForecastSearchFormComponent, NgbNavModule, DisplayDatePipe, DisplayTempPipe],
  providers: [WeatherDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('dailyWeather') dailyWeatherTemp: TemplateRef<any>;
  @ViewChild('dailyPrecipitation') dailyPrecipitationTemp: TemplateRef<any>;
  @ViewChild('dailyWind') dailyWindTemp: TemplateRef<any>;
  @ViewChild('dayDetailContainer') dayDetailContainer: ElementRef;

  dataSub: Subscription;
  forecast: Forecast;
  forecastDays: Array<string>;
  wmoMappings: WmoIconMapping;
  selectedDayForecast: DayForecast

  selectedDayPrecipData: Array<any>;


  constructor(
    protected data: WeatherDataService, 
    protected cd: ChangeDetectorRef
  ){
    this.forecastDays = [];
  }

  ngOnInit(): void {
    this.wmoMappings = this.data.WmoMappings;
    
    // this.data.getForecast();
    this.dataSub = this.data.forecast$.subscribe(
      (state: ForecastState) => {
        this.forecast = state.forecast;
        this.forecastDays = [...Object.keys(this.forecast)];
        this.selectDay(Object.keys(this.forecast)[0]);
        
        console.log(this.selectedDayPrecipData);
        console.log(this.forecastDays, this.forecast);
        
      } 
    )
  }

  selectDay(dayDate: string) {
    this.selectedDayForecast = this.forecast[dayDate];
    this.selectedDayPrecipData = Object.values(this.selectedDayForecast.hours).map((hourForecast) => { return { name: hourForecast.time, value: hourForecast.hourlyPrecip }; });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
