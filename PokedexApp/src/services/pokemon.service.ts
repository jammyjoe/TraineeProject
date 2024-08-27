import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';
import { protectedResources } from './auth.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private apiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Pokemon'; 
  private typeApiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Type'; 

  // private apiUrl = 'http://localhost:5019/api/Pokemon'; 
  // private typeApiUrl = 'http://localhost:5019/api/Type'; 

  constructor(private http: HttpClient, private msalService: MsalService) {}

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

  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.msalService.instance.acquireTokenSilent({
      scopes: [protectedResources.api.scopes[0]]
    })).pipe(
      switchMap(tokenResponse => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${tokenResponse.accessToken}`);
        return [headers];
      }),
      catchError(error => {
        console.error('Token acquisition failed:', error);
        return throwError(() => new Error('Token acquisition failed'));
      })
    );
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<Pokemon[]>(this.apiUrl, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  getPokemon(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name}`;
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<Pokemon>(url, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<Pokemon>(`${this.apiUrl}/${id}`, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.post<Pokemon>(this.apiUrl, pokemon, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  getTypes(): Observable<PokemonType[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<PokemonType[]>(this.typeApiUrl, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  updatePokemon(pokemonId: number, pokemon: any): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.put(`${this.apiUrl}/${pokemonId}`, pokemon, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }

  deletePokemon(pokemonId: number): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers =>
        this.http.delete(`${this.apiUrl}/${pokemonId}`, { headers }).pipe(
          catchError(this.handleHttpError)
        )
      )
    );
  }
}