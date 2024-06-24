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
            console.log('Pokemon fetched successfully:', response.body); // Improve logging back success
            return response.body as Pokemon;
          } else {
            throw new Error('Pokemon not found');
          }
        }),
        catchError(error => {
          return throwError(() => new Error(`${error.error}: ${error.message}`));
        })
      );
  }
}

