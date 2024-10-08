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
      errorMessage = `(Network Error) ${error.error.message}`;
    } else {
      errorMessage = `(Server Error): ${error.error || 'An unexpected error occurred.'}`;
    }
    console.error(errorMessage); 
    return throwError(() => new Error(errorMessage));
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name}`).pipe(
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

  getPokemonsByTypes(typeNames: string[]): Observable<Pokemon[]> {
    const queryString = typeNames.map(typeName => `typeNames=${encodeURIComponent(typeName)}`).join('&');
    return this.http.get<Pokemon[]>(`${this.typeApiUrl}/by-types?${queryString}`).pipe(
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
