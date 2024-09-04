import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Pokemon } from '../shared/models/pokemon.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css'
})
export class EntryComponent implements OnInit {
  pokemon!: Pokemon;
  errorMessage: string = '';

  // Mapping of Pokémon types to colors
  typeColors: { [key: string]: string } = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name');
      if (pokemonName) {
        this.pokemonService.getPokemon(pokemonName).subscribe(
          (data: Pokemon) => {
            this.pokemon = data;
          },
          error => {
            this.errorMessage = 'Error fetching Pokémon details.';
          }
        );
      }
    });
  }

  // Method to get the color for a Pokémon type
  getTypeColor(typeName: string): string {
    return this.typeColors[typeName.toLowerCase()] || '#ffffff'; // default to white if type not found
  }
}