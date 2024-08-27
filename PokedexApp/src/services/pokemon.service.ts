import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private apiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Pokemon'; 
  private typeApiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Type'; 

  // private apiUrl = 'http://localhost:5019/api/Pokemon'; 
  // private typeApiUrl = 'http://localhost:5019/api/Type'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.error}`;
    }
    console.error(`Error Status: ${error.status} - ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }

  getPokemon(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name}`;
    return this.http.get<Pokemon>(url, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleHttpError)
    );
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }

  getTypes(): Observable<PokemonType[]> {
    return this.http.get<PokemonType[]>(this.typeApiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }

  updatePokemon(pokemonId: number, pokemon: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pokemonId}`, pokemon, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }

  deletePokemon(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pokemonId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleHttpError)
    );
  }
}