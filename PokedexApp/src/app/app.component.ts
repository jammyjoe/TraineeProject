import { Component, OnInit, inject } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { Pokemon } from './shared/models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavigationComponent } from "./navigation/navigation.component";
import { ExploreComponent } from './explore/explore.component';
import { MsalBroadcastService, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { AuthenticationResult, EventType, InteractionStatus } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [PokemonService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [AsyncPipe, CommonModule, RouterModule, NavigationComponent, ExploreComponent]
})

export class AppComponent implements OnInit {
  constructor(private authService: MsalService) { }
  
  ngOnInit(): void {    
      this.authService.handleRedirectObservable().subscribe();
  }


  title = "PokemonApp";

  // pokemons$!: Observable<Pokemon[]>;
  // pokemonService = inject(PokemonService);

  // trackById(index: number, pokemon: Pokemon): number {
  //   return pokemon.id;
  // }
}