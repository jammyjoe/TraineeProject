import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private msalService: MsalService,
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.cdr.detectChanges(); 
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
    this.authService.loginPopup().subscribe({
      next: (response: AuthenticationResult) => {
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
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }
}