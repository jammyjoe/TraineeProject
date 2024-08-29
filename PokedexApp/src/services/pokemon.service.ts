import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';
import { environment } from '../environments/environment';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // private apiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Pokemon'; 
  // private typeApiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Type'; 

  private apiUrl = `${environment.baseUrl}/api/Pokemon`;
  private typeApiUrl = `${environment.baseUrl}api/Type`;

  constructor(private http: HttpClient, private msalService: MsalService) {}

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

  private handleTokenError(error: any): Observable<never> {
    // Handle errors related to token acquisition
    console.error('Failed to acquire token:', error);
    throw error;
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.msalService.acquireTokenSilent({ scopes: environment.scopeUri }).pipe(
      switchMap(tokenResponse => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenResponse.accessToken}` // Include the access token
        });
        return this.http.get<Pokemon[]>(this.apiUrl, { headers }).pipe(
          catchError(this.handleHttpError) // Handle HTTP errors
        );
      }),
      catchError(this.handleTokenError) // Handle token acquisition errors
    );
  }

  // getPokemons(): Observable<Pokemon[]> {
  //   return this.http.get<Pokemon[]>(this.apiUrl).pipe(
  //     catchError(this.handleHttpError)
  //   );
  // }

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
