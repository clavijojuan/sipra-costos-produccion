import { FormGroup } from '@angular/forms';

export const emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

export const campoValido = (form: FormGroup, campo: string) => {
  return (
    form.controls[campo].errors &&
    (form.controls[campo].dirty || form.controls[campo].touched)
  );
};

export const getErrorMsg = (form: FormGroup, campo: string): string | any => {
  const errors = form.get(campo)?.errors;
  if (errors) {
    const {
      required,
      minlength,
      maxlength,
      email,
      min,
      max,
      oneGreaterThanTwo,
      isNotArrEmail,
      maxFiles,
      valueInArr,
      pattern,
    } = errors;
    if (required) return 'Campo requerido';
    if (maxlength)
      return `Máximo de caracteres ${maxlength.requiredLength}. Caracteres ingresados ${maxlength.actualLength}`;
    if (minlength)
      return `Mínimo de caracteres ${minlength.requiredLength}. Caracteres ingresados ${minlength.actualLength}`;
    if (email) return 'Email incorrecto';
    if (min) return 'No cumple con el minimo permitido';
    if (max) return 'Supera el máximo permitido';
    if (oneGreaterThanTwo) return `El segundo valor debe ser mayor al primero`;
    if (isNotArrEmail) return `Todos los elementos deben ser de tipo email`;
    if (maxFiles) return `Ha excedido el máximo archivos permitidos`;
    if (valueInArr) return `Ya se ha creado un registro con esta opción`;
    if (pattern?.requiredPattern === emailPattern)
      return 'No cumple con el formato de un correo';
  }
};
