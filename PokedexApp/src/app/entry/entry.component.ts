import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Pokemon } from '../shared/models/pokemon.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { TypeColorService } from '../../services/typecolor.service';

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

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute, private typeColorService: TypeColorService) {}

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
  getTypeColor(typeName: string): { backgroundColor: string, fontColor: string } {
    return this.typeColorService.getTypeColor(typeName);
  }
}