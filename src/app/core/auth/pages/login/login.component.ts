import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { BaseService } from '../../../utils/base.service';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseService {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private AlertService:AlertService, private NagivateRoute: Router) {
    super();
  }

  ngOnInit() {
    this.initForm();
  } 

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res:{token: string}) => { 
          this.NagivateRoute.navigate(['/features/book/list'])
          this.AlertService.showMessage('success', 'تم تسجيل الدخول بنجاح');
          localStorage.setItem('tasktoken', res.token)
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
