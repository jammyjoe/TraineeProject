import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../shared/models/pokemon.model';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  imports: [AsyncPipe, CommonModule]
})

export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];

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
