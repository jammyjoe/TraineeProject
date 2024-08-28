import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from './shared/models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from "./navigation/navigation.component";
import { HomeComponent } from './explore/explore.component';

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

  ngOnInit(): void {
    this.pokemons$ = this.pokemonService.getPokemons();
  }

  trackById(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}