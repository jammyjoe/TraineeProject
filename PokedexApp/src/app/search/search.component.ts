import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../shared/models/pokemon.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery: string = '';
  pokemonResults$!: Observable<Pokemon[]>;

  constructor(private pokemonService: PokemonService) {}

  searchPokemon(): void {
    this.pokemonResults$ = this.pokemonService.searchPokemons(this.searchQuery);
  }
}
