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
  filteredPokemons: Pokemon[] = []; // List to hold filtered results
  displayedPokemons: Pokemon[] = [];

  constructor(
    private pokemonService: PokemonService,
     private router: Router,
     private typeColorService: TypeColorService) {}


     onSearchInput(): void {
      const query = this.searchQuery.trim().toLowerCase();
      
      if (query) {
        this.pokemonService.getPokemons().subscribe(
          (pokemons) => {
            this.filteredPokemons = pokemons.filter(pokemon =>
              pokemon.name.toLowerCase().startsWith(query)
            );
            
            if (this.filteredPokemons.length === 0) {
              this.errorMessage = 'No matching Pokémon found.';
            } else {
              this.errorMessage = '';
            }
          },
          (err) => {
            console.error('Error fetching Pokémon', err);
            this.errorMessage = 'Error fetching Pokémon.';
          }
        );
      } else {
        this.filteredPokemons = [];
        this.errorMessage = '';
      }
    }
  
    onSearchSubmit(): void {
      const query = this.searchQuery.trim().toLowerCase();
  
      if (query) {
        const exactMatch = this.filteredPokemons.find(pokemon => pokemon.name.toLowerCase() === query);
        
        if (exactMatch) {
          this.viewPokemonEntry(exactMatch.name);
        } else {
          this.errorMessage = 'This Pokémon does not exist.';
          this.filteredPokemons = [];
        }
      }
    }

  selectPokemon(pokemon: Pokemon): void {
    this.searchQuery = pokemon.name; // Set input to selected Pokémon name
    this.filteredPokemons = [pokemon]; // Show the selected Pokémon card
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
          this.successMessage = 'Pokemon successfully deleted!';
          this.errorMessage = '';
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
