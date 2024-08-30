import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [CommonModule, ReactiveFormsModule, AppComponent]
})
export class AddComponent implements OnInit{
  addPokemonForm: FormGroup;
  types: PokemonType[] = [];
  successMessage: string = '';
  pokemons: any;

  constructor(
    private pokemonService: PokemonService,
    private fb: FormBuilder,
    private router : Router) {
    this.addPokemonForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type1: ['', Validators.required],
      type2: [''],
      pokemonStrengths: this.fb.array([]),
      pokemonWeaknesses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchTypes();
  }

  fetchTypes(): void {
    this.pokemonService.getTypes().subscribe(
      types => {
        this.types = types;
      },
      error => {
        console.error('Error fetching types:', error);
        alert('Failed to fetch types. Please check the console for details.');
      }
    );
  }

  get pokemonStrengths(): FormArray {
    return this.addPokemonForm.get('pokemonStrengths') as FormArray;
  }

  get pokemonWeaknesses(): FormArray {
    return this.addPokemonForm.get('pokemonWeaknesses') as FormArray;
  }

  addStrength(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTypeName = selectElement.value;
    if (selectedTypeName) {
      const selectedType = this.types.find(type => type.typeName === selectedTypeName);
      if (selectedType) {
        this.pokemonStrengths.push(this.fb.group({
          type: selectedType
        }));
        selectElement.selectedIndex = 0;
      }
    }
  }

  removeStrength(index: number): void {
    this.pokemonStrengths.removeAt(index);
  }

  addWeakness(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTypeName = selectElement.value;
    if (selectedTypeName) {
      const selectedType = this.types.find(type => type.typeName === selectedTypeName);
      if (selectedType) {
        this.pokemonWeaknesses.push(this.fb.group({
          type: selectedType
        }));
        selectElement.selectedIndex = 0; // Reset the select element
      }
    }
  }

  removeWeakness(index: number): void {
    this.pokemonWeaknesses.removeAt(index);
  }

  onSubmit(): void {
    if (this.addPokemonForm.valid) {
      const formData = this.addPokemonForm.value;
      const pokemon: Pokemon = {
        id: 0,
        name: formData.name,
        type1: this.types.find(type => type.typeName === formData.type1)!,
        type2: formData.type2 && formData.type2 !== 'None' ? this.types.find(type => type.typeName === formData.type2) : undefined,
        pokemonStrengths: formData.pokemonStrengths.map((strength: any) => ({
          type: strength.type
        })),
        pokemonWeaknesses: formData.pokemonWeaknesses.map((weakness: any) => ({
          type: weakness.type
        }))
      };

      this.pokemonService.addPokemon(pokemon).subscribe(
        response => {
          console.log('Pokemon added successfully:', response);
          alert('Pokemon added successfully!');  
          this.addPokemonForm.reset();
          this.successMessage = 'Pokemon successfully saved.';
          this.router.navigate(['/']);
        },
        error => {
          if (error.status === 400) {
            alert(error.error.Message);
          } else {
            console.error('Error updating Pokemon:', error);
          }
        }
      );
    } else {
      alert("This form is invalid");
      console.error('Form is invalid. Cannot submit.');
    }
  }
}
