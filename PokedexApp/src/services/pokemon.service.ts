import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokedexapi20240820140804.azurewebsites.net/api/Pokemon'; 
  private typeApiUrl = 'https://pokedexapi20240820140804.azurewebsites.net/api/Pokemon/Type'; 

  // private apiUrl = 'http://localhost:5019/api/Pokemon'; 
  // private typeApiUrl = 'http://localhost:5019/api/Type'; 

  constructor(private http: HttpClient) {}

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.error}`;
    }
    alert(errorMessage); 
    console.error(errorMessage); 
    return throwError(() => new Error(errorMessage));
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  getPokemon(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name}`;
    return this.http.get<Pokemon>(url).pipe(
        catchError(this.handleHttpError)
    );
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${id}`).pipe
    (catchError(this.handleHttpError));
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon).pipe(
      catchError(this.handleHttpError)
    );
  }

  getTypes(): Observable<PokemonType[]> {
    return this.http.get<PokemonType[]>(this.typeApiUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  updatePokemon(pokemonId: number, pokemon: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pokemonId}`, pokemon).pipe
    (catchError(this.handleHttpError));
  }

  deletePokemon(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pokemonId}`).pipe
      (catchError(this.handleHttpError));
  }

}

