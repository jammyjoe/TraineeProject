import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from './shared/models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from "./navigation/navigation.component";
import { HomeComponent } from './home/home.component';
import { msalConfig, msalInstance, protectedResources } from '../services/auth.service';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [PokemonService, MsalService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [AsyncPipe, CommonModule, RouterModule, NavigationComponent, HomeComponent],
})
export class AppComponent implements OnInit {
  title = "PokemonApp";
  pokemons$!: Observable<Pokemon[]>;

  constructor(private pokemonService: PokemonService, private msalService: MsalService) {}

  ngOnInit(): void {
    const msalInstance = new PublicClientApplication(msalConfig);

    // Use MsalService's instance to handle authentication
    this.msalService.instance = msalInstance;

    this.msalService.instance.handleRedirectPromise().then((response) => {
      if (response !== null) {
        // Successfully authenticated
        console.log('Authentication successful:', response);
      } else {
        // Check if user is already logged in
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length === 0) {
          this.msalService.instance.loginRedirect({
            scopes: [protectedResources.api.scopes[0]]
          });
        }
      }
    }).catch((error) => {
      console.error('Error during authentication:', error);
    });

    this.pokemons$ = this.pokemonService.getPokemons();
  }

  trackById(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}