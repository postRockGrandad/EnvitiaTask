import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { WeatherDataService } from '../../services/weather-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'forecast-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forecast-search-form.component.html',
  styleUrl: './forecast-search-form.component.css'
})
export class ForecastSearchFormComponent {
  forecastForm: FormGroup;

  get latitudeCtrl(): AbstractControl { return this.forecastForm.get('latitude'); }
  get latitude(): number { return Number(this.latitudeCtrl.value); }
  set latitude(value: number) { this.latitudeCtrl.setValue(value); }
  get longitudeCtrl(): AbstractControl { return this.forecastForm.get('longitude'); }
  get longitude(): number { return Number(this.longitudeCtrl.value); }
  set longitude(value: number) { this.longitudeCtrl.setValue(value); }
  
  //could be in global Validators class if useful outside of this component
  latitudeInRange: ValidatorFn = (ctrl: AbstractControl): ValidationErrors | null => {
    let value: number = Number(ctrl.value);
    
    if(value < -90 || value > 90){
      return { latitudeInRange: ctrl.value };
    }

    return null;
  }
  longitudeInRange: ValidatorFn = (ctrl: AbstractControl): ValidationErrors | null => {
    let value: number = Number(ctrl.value);
    
    if(value < -180 || value > 180){
      return { longitudeInRange: ctrl.value };
    }

    return null;
  }

  constructor(
    protected data: WeatherDataService
  ) {
    this.forecastForm = new FormGroup({
      latitude: new FormControl<string>('', [Validators.required, this.latitudeInRange]),
      longitude: new FormControl<string>('', [Validators.required, this.longitudeInRange])
    });
  }

  getForecast(){
    if(this.forecastForm.valid){
      this.data.getForecast(this.latitude, this.longitude);
    }
  }
}
