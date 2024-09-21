import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDecimalFormat',
  standalone: true
})
export class CustomDecimalFormatPipe implements PipeTransform {

  transform(value: number, decimalPlaces: number = 2): string {
    // Verificar si el valor es un número
    if (isNaN(value)) {
      return value.toString();
    }

    if (decimalPlaces == 0) {
      const formattedValue = value
        .toFixed(decimalPlaces)
        .replace(/\B(?=(\d{3})+(?!\d))/g, "$&,");
      return formattedValue
        .replaceAll(",", ";")
        .replaceAll(".", ",")
        .replaceAll(";", ".");
    } else {
      const formattedValue = value
        .toFixed(decimalPlaces)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      return formattedValue
        .replaceAll(",", ";")
        .replaceAll(".", ",")
        .replaceAll(";", ".");
    }
  }

}
