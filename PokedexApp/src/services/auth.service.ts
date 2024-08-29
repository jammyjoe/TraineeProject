import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private msalService: MsalService) {}

  isAuthenticated(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  loginPopup() {
    return this.msalService.loginPopup();
  }

  logout() {
    this.msalService.logoutPopup();
  }
  acquireTokenSilent(scopes: string[]): Observable<AuthenticationResult> {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount) {
      throw new Error('No active account found');
    }

    return from(
      this.msalService.acquireTokenSilent({
        scopes,
        account: activeAccount,
      })
    );
  }
}
