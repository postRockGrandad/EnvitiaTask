import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayTemp',
  standalone: true
})
export class DisplayTempPipe implements PipeTransform {

   transform(value: number | string): string {
    let val: number = Number(value);

    return val.toFixed(1) + "°C";
  }

}
