import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TypeColorService } from '../../services/typecolor.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  imports: [AsyncPipe, CommonModule]
})

export class ExploreComponent implements OnInit {
  pokemons: Pokemon[] = [];
  types: PokemonType[] = [];

  constructor(
  private pokemonService: PokemonService,
  private typeColorService: TypeColorService, 
  private router: Router) {}

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemonService.getPokemons().subscribe(
      (pokemons) => {
        this.pokemons = pokemons;
      },
      (error) => {
        console.error('Error fetching pokemons:', error);
      }
    );
  }

  getTypeColor(typeName: string): string {
    return this.typeColorService.getTypeColor(typeName);
  }

  viewPokemonEntry(name: string): void {
    this.router.navigate([`/pokemon/${name}`]);
  }
}
