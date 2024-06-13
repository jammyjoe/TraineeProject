import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { PokemonService } from '../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  providers: [PokemonService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
