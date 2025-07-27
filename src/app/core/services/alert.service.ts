import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
 
  showMessage(color:string,msg = '', showCloseButton = true, duration = 4000){
    const toast = Swal.mixin({
        toast: true,
        position:'top-end',
        showConfirmButton: false,
        timer: duration,
        showCloseButton: showCloseButton,
        customClass: {
          popup: `color-${color}`
      }
    });
    toast.fire({
        title: msg,
    });
  };


 
}
