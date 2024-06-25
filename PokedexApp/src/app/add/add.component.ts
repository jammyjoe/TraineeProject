import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PokemonType, Pokemon } from '../shared/models/pokemon.model';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddComponent implements OnInit {
  addPokemonForm: FormGroup;
  types: PokemonType[] = [];
  selectedStrengths: PokemonType[] = [];
  selectedWeaknesses: PokemonType[] = [];

  constructor(private fb: FormBuilder, private pokemonService: PokemonService) {
    this.addPokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: ['', Validators.required],
      type2: [''],
      pokemonStrengths: this.fb.array([]), // You'll need to handle strengths and weaknesses
      pokemonWeaknesses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.pokemonService.getTypes().subscribe(
      (types) => {
        this.types = types;
      },
      (error) => {
        console.error('Error fetching types', error);
      }
    );
  }

  selectStrength(type: PokemonType): void {
    if (!this.selectedStrengths.includes(type)) {
      this.selectedStrengths.push(type);
    }
  }

  removeStrength(type: PokemonType): void {
    this.selectedStrengths = this.selectedStrengths.filter(t => t !== type);
  }

  selectWeakness(type: PokemonType): void {
    if (!this.selectedWeaknesses.includes(type)) {
      this.selectedWeaknesses.push(type);
    }
  }

  removeWeakness(type: PokemonType): void {
    this.selectedWeaknesses = this.selectedWeaknesses.filter(t => t !== type);
  }

  onSubmit(): void {
    if (this.addPokemonForm.valid) {
      const pokemonDto: Pokemon = {
        ...this.addPokemonForm.value,
        pokemonStrengths: this.selectedStrengths.map(type => ({ type })),
        pokemonWeaknesses: this.selectedWeaknesses.map(type => ({ type })),
      };
      this.pokemonService.addPokemon(pokemonDto).subscribe(
        response => {
          console.log('Pokemon added successfully', response);
          this.addPokemonForm.reset();
          this.selectedStrengths = [];
          this.selectedWeaknesses = [];
        },
        error => {
          console.error('Error adding pokemon', error);
        }
      );
    }
  }
}
