import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanArray',
  standalone: true,
})
export class BooleanArrayPipe implements PipeTransform {
  transform(value: boolean[]): string[] {
    return value.map((boolean) => (boolean ? 'Si' : 'No'));
  }
}
