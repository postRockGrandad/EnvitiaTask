import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { WeatherDataService } from '../../services/weather-data.service';

@Component({
  selector: 'forecast-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forecast-search-form.component.html',
  styleUrl: './forecast-search-form.component.css'
})
export class ForecastSearchFormComponent {
  forecastForm: FormGroup;
  
  get latitude(): number { return Number(this.forecastForm.get('latitude').value); }
  set latitude(value: number) { this.forecastForm.get('latitude').setValue(value); }
  get longitude(): number { return Number(this.forecastForm.get('longitude').value); }
  set longitude(value: number) { this.forecastForm.get('longitude').setValue(value); }
  
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
    } else {
      console.log(this.forecastForm);
    }
    //recative errors already showing if not
  }
}
