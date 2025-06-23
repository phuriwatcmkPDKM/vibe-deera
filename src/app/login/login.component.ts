import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JiraAuthService } from '../services/jira-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private jiraAuthService: JiraAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      jiraUrl: ['https://demo.atlassian.net', [Validators.required, Validators.pattern('https?://.+')]],
      email: ['demo@example.com', [Validators.required, Validators.email]],
      apiToken: ['demo-token-123', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = this.loginForm.value;
      
      this.jiraAuthService.login(credentials).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (errorMessage) => {
          console.error('Login failed:', errorMessage);
          this.errorMessage = errorMessage;
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get jiraUrl() { return this.loginForm.get('jiraUrl'); }
  get email() { return this.loginForm.get('email'); }
  get apiToken() { return this.loginForm.get('apiToken'); }
}