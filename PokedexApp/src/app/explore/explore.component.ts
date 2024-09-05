import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TypeColorService } from '../../services/typecolor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  imports: [AsyncPipe, CommonModule]
})

export class ExploreComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  types: PokemonType[] = [];
  selectedTypes: Set<string> = new Set();
  showDropdown: boolean = false;
  private clickSubscription: Subscription = new Subscription();

  constructor(
  private pokemonService: PokemonService,
  private typeColorService: TypeColorService, 
  private router: Router,
  private renderer: Renderer2,
  private el: ElementRef
) {}

  ngOnInit(): void {
    this.loadAllPokemons();
    this.loadPokemonTypes();
    this.addClickListener();
  }

  ngOnDestroy(): void {
    this.removeClickListener();
  }

  loadAllPokemons(): void {
    this.pokemonService.getPokemons().subscribe(
      (pokemons) => {
        this.pokemons = pokemons;
        this.filteredPokemons = this.pokemons; // Initialize with all Pokémon
      },
      (error) => {
        console.error('Error fetching pokemons:', error);
      }
    );
  }

  loadPokemonTypes(): void {
    this.pokemonService.getTypes().subscribe(
      (types) => {
        this.types = types;
      },
      (error) => {
        console.error('Error fetching types:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  
  filterPokemonsByType(typeName: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedTypes.add(typeName);
    } else {
      this.selectedTypes.delete(typeName);
    }

    if (this.selectedTypes.size > 0) {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        this.selectedTypes.has(pokemon.type1.typeName) || 
        (pokemon.type2 && this.selectedTypes.has(pokemon.type2.typeName))
      );
    } else {
      this.filteredPokemons = [...this.pokemons]; // Show all if no filters are selected
    }
  }

  private addClickListener(): void {
    this.clickSubscription.add(this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!this.el.nativeElement.contains(target) && this.showDropdown) {
        this.showDropdown = false;
      }
    }));
  }
  
  private removeClickListener(): void {
    this.clickSubscription.unsubscribe();
  }

  getTypeColor(typeName: string): { backgroundColor: string, fontColor: string } {
    return this.typeColorService.getTypeColor(typeName);
  }

  viewPokemonEntry(name: string): void {
    this.router.navigate([`/pokemon/${name}`]);
  }
}
