import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayWindSpeed',
  standalone: true
})
export class DisplayWindSpeedPipe implements PipeTransform {

  transform(value: number | string): string {
    let val: number = Number(value);

    return val.toFixed(1) + "km/h";
  }

}
