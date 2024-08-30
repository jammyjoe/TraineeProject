import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { AsyncPipe, CommonModule } from '@angular/common';

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

  constructor(private pokemonService: PokemonService) {}

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
}
