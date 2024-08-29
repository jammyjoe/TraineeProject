import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, filter, switchMap, takeUntil } from 'rxjs';
import { Pokemon } from './shared/models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExploreComponent } from './explore/explore.component';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { AuthenticationResult, EventType, InteractionStatus } from '@azure/msal-browser';
import { AuthService } from '../services/auth.service';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [PokemonService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [AsyncPipe, CommonModule, RouterModule, ExploreComponent, NavigationComponent, HomeComponent ]
})

export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  title = "PokemonApp";

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize MSAL and handle redirects
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.msalService.instance.setActiveAccount(result.account);
          this.router.navigate(['/explore']); 
        }
      },
      error: (error) => {
        console.error('Error handling redirect promise:', error);
      }
    });

    // Subscribe to authentication state changes
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // You can also update the state here if needed
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}