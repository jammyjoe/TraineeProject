import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pokemon } from '../shared/models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, AsyncPipe, FormsModule]
})
export class SearchComponent {
  searchQuery: string = '';
  pokemonResult$!: Observable<Pokemon | null>;
  errorMessage: string = '';

  constructor(private pokemonService: PokemonService) {}

  searchPokemon(): void {
    if (this.searchQuery.trim()) {
      this.errorMessage = '';
      this.pokemonResult$ = this.pokemonService.getPokemon(this.searchQuery).pipe(
        catchError(err => {
          console.error('Search failed', err);
          this.errorMessage = 'Pokemon not found.';
          return of(null);
        })
      );
    }
  }
}
