import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';
import { WeatherDataService } from './services/weather-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TextCarouselComponent],
  providers: [WeatherDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'WeatherEnvitia';

  constructor(protected data: WeatherDataService){

  }

  ngOnInit(): void {
    this.data.getForecast();
  }
}
