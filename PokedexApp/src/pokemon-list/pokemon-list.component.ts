import { Component, Input } from '@angular/core';
import { Pokemon } from '../app/shared/models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent {
  @Input() pokemons: Pokemon[] = [];

  constructor() { }
}
