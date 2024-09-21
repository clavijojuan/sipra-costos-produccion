import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  success(msg: string) {
    Toast.fire({
      icon: 'success',
      title: msg,
    });
  }

  error(msg: string) {
    Toast.fire({
      icon: 'error',
      title: msg,
    });
  }
}
