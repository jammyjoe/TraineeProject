import { Injectable } from '@angular/core';
import { PublicClientApplication, AuthenticationResult, RedirectRequest } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: '76792183-f318-4ab5-9eab-da4315d62dc3', // Replace with your client ID
        authority: 'https://login.microsoftonline.com/e712b66c-2cb8-430e-848f-dbab4beb16df', // Replace with your tenant ID
        redirectUri: 'http://localhost:4200/', // Replace with your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
      }
    });
  }

  login(): void {
    const loginRequest: RedirectRequest = {
      scopes: ['api://76792183-f318-4ab5-9eab-da4315d62dc3/.default'] // Replace with your API scopes
    };
    this.msalInstance.loginRedirect(loginRequest);
  }

  logout(): void {
    this.msalInstance.logoutRedirect();
  }

  async getToken(): Promise<string | null> {
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const silentRequest = {
        account: accounts[0],
        scopes: ['api://76792183-f318-4ab5-9eab-da4315d62dc3.default'] // Replace with your API scopes
      };
      try {
        const response: AuthenticationResult = await this.msalInstance.acquireTokenSilent(silentRequest);
        return response.accessToken;
      } catch (error) {
        console.error('Error acquiring token silently', error);
        await this.msalInstance.acquireTokenRedirect(silentRequest);
        return null;
      }
    } else {
      this.login();
      return null;
    }
  }
}
