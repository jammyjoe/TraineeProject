import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Pokemon, PokemonType } from '../app/shared/models/pokemon.model';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = `${environment.baseUrl}/api/pokemon`;
  private typeApiUrl = `${environment.baseUrl}/api/type`;
  private imageApiUrl = `${environment.baseUrl}/api/image/pokemon`;


  constructor(private http: HttpClient, private authService: AuthService) {}

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

  // getPokemons(): Observable<Pokemon[]> {
  //   return this.getAuthHeaders().pipe(
  //     switchMap(headers => this.http.get<Pokemon[]>(this.apiUrl, { headers })),
  //     catchError(this.handleHttpError)
  //   );
  // }

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

  getPokemonImages(): Observable<{ url: string, name: string }[]> {
    return this.http.get<{ url: string, name: string }[]>(this.imageApiUrl);
  }
}
