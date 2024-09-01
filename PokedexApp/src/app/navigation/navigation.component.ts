import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthenticationResult } from '@azure/msal-browser';

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
    private router: Router,
    private cdr: ChangeDetectorRef, 
    private authService: AuthService,
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
      error: (error: any) => {
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
