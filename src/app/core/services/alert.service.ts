import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
 
  showMessage(color: string, msg: string = '', showCloseButton: boolean = true, duration: number = 4000) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      showCloseButton: showCloseButton,
      background: this.getBackgroundColor(color),
      color: '#ffffff', // White text for better contrast
      customClass: {
        popup: `custom-swal-popup color-${color}`,
        title: 'swal2-title-custom'
      }
    });
    
    toast.fire({
      title: msg
    });
  }

  private getBackgroundColor(color: string): string {
    const colors: {[key: string]: string} = {
      'success': '#28a745',
      'error': '#dc3545',
      'danger': '#dc3545',
      'warning': '#ffc107',
      'info': '#17a2b8',
      'primary': '#007bff'
    };
    
    return colors[color] || '#343a40'; // default dark color
  }
}