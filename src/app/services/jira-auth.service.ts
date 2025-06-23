import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

export interface JiraCredentials {
  jiraUrl: string;
  email: string;
  apiToken: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls: any;
}

@Injectable({
  providedIn: 'root'
})
export class JiraAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<JiraUser | null>(null);
  private credentialsSubject = new BehaviorSubject<JiraCredentials | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  public credentials$ = this.credentialsSubject.asObservable();

  constructor() {
    this.loadStoredCredentials();
  }

  login(credentials: JiraCredentials): Observable<JiraUser> {
    return new Observable(observer => {
      // Mock authentication - simulate API delay
      setTimeout(() => {
        // Simple validation - any non-empty fields are valid
        if (!credentials.jiraUrl || !credentials.email || !credentials.apiToken) {
          observer.error('All fields are required');
          return;
        }

        // Create mock user based on email
        const mockUser: JiraUser = {
          accountId: 'mock-' + Math.random().toString(36).substr(2, 9),
          displayName: credentials.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          emailAddress: credentials.email,
          avatarUrls: {
            '16x16': 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-2.png',
            '24x24': 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-2.png',
            '32x32': 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-2.png',
            '48x48': 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-2.png'
          }
        };

        this.setAuthenticated(true);
        this.currentUserSubject.next(mockUser);
        this.credentialsSubject.next(credentials);
        this.storeCredentials(credentials);

        console.log('Mock authentication successful for:', credentials.email);
        observer.next(mockUser);
        observer.complete();
      }, 1000); // Simulate 1 second API delay
    });
  }

  logout(): void {
    this.setAuthenticated(false);
    this.currentUserSubject.next(null);
    this.credentialsSubject.next(null);
    this.clearStoredCredentials();
  }

  getCurrentCredentials(): JiraCredentials | null {
    return this.credentialsSubject.value;
  }

  getCurrentUser(): JiraUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  createAuthHeader(email: string, apiToken: string): string {
    const credentials = btoa(`${email}:${apiToken}`);
    return `Basic ${credentials}`;
  }

  getAuthHeaders(): any | null {
    const credentials = this.getCurrentCredentials();
    if (!credentials) {
      return null;
    }

    // Return mock headers object (not real HttpHeaders since we're not making real HTTP calls)
    return {
      'Authorization': this.createAuthHeader(credentials.email, credentials.apiToken),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  private setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  private storeCredentials(credentials: JiraCredentials): void {
    localStorage.setItem('jira_credentials', JSON.stringify(credentials));
  }

  private loadStoredCredentials(): void {
    const stored = localStorage.getItem('jira_credentials');
    if (stored) {
      try {
        const credentials = JSON.parse(stored);
        this.credentialsSubject.next(credentials);
        this.validateStoredCredentials(credentials);
      } catch (error) {
        this.clearStoredCredentials();
      }
    }
  }

  private validateStoredCredentials(credentials: JiraCredentials): void {
    // For mock auth, just validate that credentials exist
    if (credentials.jiraUrl && credentials.email && credentials.apiToken) {
      this.login(credentials).subscribe({
        next: (user) => {
          console.log('Mock auto-login successful', user);
        },
        error: (error) => {
          console.log('Stored credentials invalid, clearing...', error);
          this.clearStoredCredentials();
        }
      });
    } else {
      this.clearStoredCredentials();
    }
  }

  private clearStoredCredentials(): void {
    localStorage.removeItem('jira_credentials');
  }

}