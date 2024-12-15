import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'displayDate',
  standalone: true
})
export class DisplayDatePipe implements PipeTransform {

  transform(value: string): string {
    return DateTime.fromISO(value, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED);
  }

}
