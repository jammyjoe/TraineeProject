import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  isAuthenticated: boolean = false;
  isInteractionInProgress: boolean = false;

  constructor(private msalService: MsalService,
              private msalBroadCastService: MsalBroadcastService,
              private router: Router,
              private cdr: ChangeDetectorRef) 
              {    this.msalService.initialize();
              }

  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then(res => {
      if (res && res.account) {
        this.msalService.instance.setActiveAccount(res.account);
        this.isAuthenticated = true;
        this.router.navigate(['/explore']); 
      } else {
        this.isAuthenticated = !!this.msalService.instance.getActiveAccount();
      }
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error handling redirect promise:', error);
    });

    // Subscribe to authentication state changes
    this.msalBroadCastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isAuthenticated = !!this.msalService.instance.getActiveAccount();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  login() {
    if (this.isInteractionInProgress) {
      return;
    }
    this.isInteractionInProgress = true;
    this.msalService.loginPopup().subscribe({
      next: (response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
        this.isAuthenticated = true;
        this.isInteractionInProgress = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        this.isInteractionInProgress = false;
        this.cdr.detectChanges();
      }
    });
  }
  logout() {
    this.msalService.logoutPopup({ postLogoutRedirectUri: environment.redirectUrl });
    this.router.navigate(['/']); 
  }
}
