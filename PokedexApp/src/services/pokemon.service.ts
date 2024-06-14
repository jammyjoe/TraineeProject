import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon } from '../app/shared/models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'http://localhost:5019/api/Pokemon';

  constructor(private http: HttpClient) {}

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl);
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Pokemon>) => {
          if (response.status === 200) {
            return response.body as Pokemon;
          } else {
            throw new Error('Failed to fetch Pokemon');
          }
        }),
        catchError(error => {
          return throwError(() => new Error('Failed to fetch Pokemon: ' + error.message));
        })
      );
  }
}

