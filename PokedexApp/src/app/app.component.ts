import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "PokemonApp";
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:5019/api/Pokemon';
  pokemons$!: Observable<Pokemon[]>;

  ngOnInit(): void {
    this.pokemons$ = this.getPokemons();
  }

  private getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}`);
  }

  trackById(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}
