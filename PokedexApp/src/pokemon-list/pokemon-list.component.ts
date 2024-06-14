// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Pokemon } from '../models/pokemon.model';
// import { PokemonService } from '../services/pokemon.service';

// @Component({
//   selector: 'app-pokemon-list',
//   templateUrl: './pokemon-list.component.html',
//   styleUrls: ['./pokemon-list.component.css']
// })
// export class PokemonListComponent implements OnInit {
//   pokemons$: Observable<Pokemon[]> = new Observable<Pokemon[]>(); // Initialize here

//   constructor(private pokemonService: PokemonService) { }

//   ngOnInit(): void {
//     this.getPokemons();
//   }

//   getPokemons(): void {
//     this.pokemons$ = this.pokemonService.getPokemons();
//   }
// }
