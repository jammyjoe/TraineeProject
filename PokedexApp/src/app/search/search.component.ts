import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pokemon } from '../shared/models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  successMessage: string = '';

  constructor(private pokemonService: PokemonService, private router: Router) {}

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
  
  editPokemon(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  viewPokemonEntry(name: string): void {
    this.router.navigate([`/pokemon/${name}`]);
  }
  

  deletePokemon(pokemonId: number): void {
    if (confirm('Are you sure you want to delete this Pokémon?')) {
      this.pokemonService.deletePokemon(pokemonId).subscribe(
        () => {
          alert('Pokemon successfully deleted!'); 
          this.router.navigate(['/explore']); 
        },
        error => {
          console.error('Error deleting Pokémon', error);
          alert('There was an error deleting the Pokémon. Please try again later.');
        }
      );
    }
  }
}

