import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from './shared/models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AuthService } from '../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from "./navigation/navigation.component";
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [PokemonService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [AsyncPipe, CommonModule, RouterModule, NavigationComponent, HomeComponent]
})
export class AppComponent implements OnInit {
  title = "PokemonApp";
  pokemons$!: Observable<Pokemon[]>;

  pokemonService = inject(PokemonService);
  authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    await this.authService.getToken();  // Ensure user is authenticated
    this.pokemons$ = await this.pokemonService.getPokemons();
  }

  trackById(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}
