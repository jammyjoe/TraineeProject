import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private msalService: MsalService) {}

  isAuthenticated(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  loginPopup(): Observable<AuthenticationResult> {
    return from(this.msalService.loginPopup()).pipe(
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      }),
      // Set the active account after a successful login
      map((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        return response;
      })
    );
  }

  logout(): void {
    this.msalService.logoutPopup();
    this.msalService.instance.setActiveAccount(null); // Clear the active account on logout
  }

  acquireToken(): Observable<string> {
    const request = {
      scopes: environment.scopeUri // Replace with your API's scope
    };

    return from(this.msalService.acquireTokenSilent(request)).pipe(
      map(response => {
        if (response && response.accessToken) {
          return response.accessToken;
        } else {
          throw new Error('No access token received');
        }
      }),
      catchError(error => {
        console.error('Error acquiring token:', error);
        return throwError(() => new Error('Token acquisition failed'));
      })
    );
  }
}
