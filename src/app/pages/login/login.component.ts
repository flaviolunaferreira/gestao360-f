import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/login/AuthService.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../interface/Login';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value); // Para depuração
      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: () => {
          console.log('Login successful, redirecting...');
          this.router.navigate(['/app.component']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          // Aqui você pode adicionar um feedback visual para o usuário, como uma mensagem de erro
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}