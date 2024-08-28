import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "../environments/environment";
import { Pokemon } from '../app/shared/models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
isAuthenticated: boolean = false;

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }  
  
  constructor() { }
}

