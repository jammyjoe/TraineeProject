import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
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
      switchMap((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        return from([response]);
      })
    );
  }

  logout(): void {
    this.msalService.logoutPopup();
    this.msalService.instance.setActiveAccount(null); // Clear the active account on logout
  }

  private setActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount) {
      const allAccounts = this.msalService.instance.getAllAccounts();
      if (allAccounts.length > 0) {
        this.msalService.instance.setActiveAccount(allAccounts[0]);
      }
    }
  }

  acquireToken(): Observable<string> {
    const request = {
      scopes: environment.scopeUri // Replace with your API's scope
    };

    return from(this.msalService.acquireTokenSilent(request)).pipe(
      switchMap(response => {
        if (response && response.accessToken) {
          return new Observable<string>(observer => {
            observer.next(response.accessToken);
            observer.complete();
          });
        } else {
          throw new Error('No access token received');
        }
      }),
      catchError(error => {
        console.error('Error acquiring token:', error);
        throw error;
      })
    );
  }
}

