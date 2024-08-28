import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private msalService: MsalService) {}

  isAuthenticated(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }
}

