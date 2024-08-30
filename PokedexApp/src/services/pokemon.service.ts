import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';
import { environment } from '../environments/environment';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // private apiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Pokemon'; 
  // private typeApiUrl = 'https://pokedex-dev-web-api.azurewebsites.net/api/Type'; 

  private apiUrl = `${environment.baseUrl}/api/Pokemon`;
  private typeApiUrl = `${environment.baseUrl}api/Type/fire`;

  constructor(private http: HttpClient, private authService: AuthService,
    private msalService: MsalService) {}

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.error}`;
    }
    console.error(errorMessage); 
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return new Observable<HttpHeaders>(observer => {
          observer.next(headers);
          observer.complete();
        });
      })
    );
  }


  // getPokemons(): Observable<Pokemon[]> {
  //   return this.authService.acquireToken().pipe(
  //     switchMap(token => {
  //       const headers = this.getHeaders(token);
  //       return this.http.get<Pokemon[]>(this.apiUrl, { headers }).pipe(
  //         catchError(this.handleHttpError)
  //       );
  //     })
  //   );
  // }

  getPokemons(): Observable<Pokemon[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<Pokemon[]>(this.apiUrl, { headers })),
      catchError(this.handleHttpError)
    );
  }

  // getPokemons(): Observable<Pokemon[]> {
  //   return this.http.get<Pokemon[]>(this.apiUrl).pipe(
  //     catchError(this.handleHttpError)
  //   );
  // }

  getPokemon(name: string): Observable<Pokemon> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/${name}`;
        return this.http.get<Pokemon>(url, { headers }).pipe(
          catchError(this.handleHttpError)
        );
      })
    );
  }

  // getPokemon(name: string): Observable<Pokemon> {
  //   const url = `${this.apiUrl}/${name}`;
  //   return this.http.get<Pokemon>(url).pipe(
  //       catchError(this.handleHttpError)
  //   );
  // }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Pokemon>(url, { headers }).pipe(
          catchError(this.handleHttpError)
        );
      })
    );
  }

  // getPokemonById(id: number): Observable<Pokemon> {
  //   return this.http.get<Pokemon>(`${this.apiUrl}/${id}`).pipe
  //   (catchError(this.handleHttpError));
  // }


  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.post<Pokemon>(this.apiUrl, pokemon, { headers }).pipe(
          catchError(this.handleHttpError)
        );
      })
    );
  }

  // addPokemon(pokemon: Pokemon): Observable<Pokemon> {
  //   return this.http.post<Pokemon>(this.apiUrl, pokemon).pipe(
  //     catchError(this.handleHttpError)
  //   );
  // }

  // getTypes(): Observable<PokemonType[]> {
  //   return this.msalService.acquireTokenSilent({ scopes: ["api://76792183-f318-4ab5-9eab-da4315d62dc3/pokedex-read"] }).pipe(
  //     switchMap(tokenResponse => {
  //       const headers = new HttpHeaders({
  //         'Authorization': `Bearer ${tokenResponse.accessToken}` // Include the access token
  //       });
  //       return this.http.get<PokemonType[]>(this.typeApiUrl, { headers }).pipe(
  //         catchError(error => {
  //           console.error('Error fetching types:', error);
  //           return throwError(() => new Error('Failed to fetch types.'));
  //         })
  //       );
  //     }),
  //     catchError(error => {
  //       console.error('Error acquiring token:', error);
  //       return throwError(() => new Error('Failed to acquire token.'));
  //     })
  //   );
  // }
  
  getTypes(): Observable<PokemonType[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<PokemonType[]>(this.typeApiUrl, { headers })),
      catchError(this.handleHttpError)
    );
  }
  
  // getTypes(): Observable<PokemonType[]> {
  //   return this.authService.acquireToken().pipe(
  //     switchMap(token => {
  //       const headers = this.getHeaders(token);
  //       return this.http.get<PokemonType[]>(this.typeApiUrl, { headers }).pipe(
  //         catchError(this.handleHttpError)
  //       );
  //     })
  //   );
  // }

  // getTypes(): Observable<PokemonType[]> {
  //   return this.http.get<PokemonType[]>(this.typeApiUrl).pipe(
  //     catchError(this.handleHttpError)
  //   );
  // }

  updatePokemon(pokemonId: number, pokemon: any): Observable<any> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.put(`${this.apiUrl}/${pokemonId}`, pokemon, { headers }).pipe(
          catchError(this.handleHttpError)
        );
      })
    );
  }

  // updatePokemon(pokemonId: number, pokemon: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${pokemonId}`, pokemon).pipe
  //   (catchError(this.handleHttpError));
  // }
  
  deletePokemon(pokemonId: number): Observable<any> {
    return this.authService.acquireToken().pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.delete(`${this.apiUrl}/${pokemonId}`, { headers }).pipe(
          catchError(this.handleHttpError)
        );
      })
    );
  }
}

  // deletePokemon(pokemonId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${pokemonId}`).pipe
  //     (catchError(this.handleHttpError));
  // }

