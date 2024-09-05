import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pokemon } from '../shared/models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeColorService } from '../../services/typecolor.service';

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

  constructor(
    private pokemonService: PokemonService,
     private router: Router,
     private typeColorService: TypeColorService) {}

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


  getTypeColor(typeName: string): { backgroundColor: string, fontColor: string } {
    return this.typeColorService.getTypeColor(typeName);
  }

  viewPokemonEntry(pokemonName: string): void {
    this.router.navigate([`/pokemon/${pokemonName}`]);
  }
  

  deletePokemon(pokemonId: number): void {
    if (confirm('Are you sure you want to delete this Pokémon?')) {
      this.pokemonService.deletePokemon(pokemonId).subscribe(
        () => {
          // Show success message for deletion
          this.successMessage = 'Pokemon successfully deleted!';
          this.errorMessage = '';

          // Delay navigation for 3 seconds (3000ms) to show the message
          setTimeout(() => {
            this.router.navigate(['/explore']);
          }, 1000);
        },
        error => {
          console.error('Error deleting Pokémon', error);
          this.errorMessage = 'There was an error deleting the Pokémon. Please try again later.';
        }
      );
    }
  }
}
