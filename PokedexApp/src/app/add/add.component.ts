import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType, PokemonStrength, PokemonWeakness } from '../shared/models/pokemon.model';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddComponent implements OnInit {
  addPokemonForm: FormGroup;
  types: PokemonType[] = [];

  constructor(private fb: FormBuilder, private pokemonService: PokemonService) {
    this.addPokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: ['', Validators.required],
      type2: [''],
      pokemonStrengths: this.fb.array([]),
      pokemonWeaknesses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.pokemonService.getTypes().subscribe(
      types => {
        this.types = types;
      },
      error => {
        console.error('Error fetching types', error);
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
    const selectedType = this.types.find(type => type.typeName === selectedTypeName);
    if (selectedType) {
      this.pokemonStrengths.push(this.fb.group({
        type: this.fb.group(selectedType),
        pokemonId: [null] // Initialize with null or some other default value
      }));
    }
  }

  removeStrength(index: number): void {
    this.pokemonStrengths.removeAt(index);
  }

  addWeakness(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTypeName = selectElement.value;
    const selectedType = this.types.find(type => type.typeName === selectedTypeName);
    if (selectedType) {
      this.pokemonWeaknesses.push(this.fb.group({
        type: this.fb.group(selectedType),
        pokemonId: [null] // Initialize with null or some other default value
      }));
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
        type2: formData.type2 ? this.types.find(type => type.typeName === formData.type2) : undefined,
        pokemonStrengths: formData.pokemonStrengths.map((strength: any) => ({
          ...strength,
          pokemonId: 0 // Assign the PokemonId here, or update it after the Pokemon is created
        })),
        pokemonWeaknesses: formData.pokemonWeaknesses.map((weakness: any) => ({
          ...weakness,
          pokemonId: 0 // Assign the PokemonId here, or update it after the Pokemon is created
        }))
      };

      this.pokemonService.addPokemon(pokemon).subscribe(
        response => {
          console.log('Pokemon added successfully:', response);
          // Here, you should update pokemonId for each strength and weakness if needed
          this.addPokemonForm.reset();
        },
        error => {
          console.error('Error adding Pokemon:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
}
