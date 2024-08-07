import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditComponent implements OnInit {
  editPokemonForm: FormGroup;
  types: PokemonType[] = [];
  successMessage: string = '';
  pokemonId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {
    this.editPokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: ['', Validators.required],
      type2: [''],
      pokemonStrengths: this.fb.array([]),
      pokemonWeaknesses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch Pokémon types
    this.pokemonService.getTypes().subscribe(
      (types: PokemonType[]) => {
        this.types = types;
      },
      error => {
        console.error('Error fetching types', error);
      }
    );

    // Fetch Pokémon data by ID
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pokemonService.getPokemonById(+id).subscribe(
          (pokemon: Pokemon) => {
            this.editPokemonForm.patchValue({
              name: pokemon.name,
              type1: pokemon.type1.typeName,
              type2: pokemon.type2 ? pokemon.type2.typeName : ''
            });

            // Populate strengths and weaknesses
            this.setFormArray('pokemonStrengths', pokemon.pokemonStrengths);
            this.setFormArray('pokemonWeaknesses', pokemon.pokemonWeaknesses);
          },
          error => {
            console.error('Error fetching Pokémon data', error);
          }
        );
      }
    });
  }

  setFormArray(arrayName: string, values: any[]): void {
    const control = this.editPokemonForm.get(arrayName) as FormArray;
    values.forEach(value => {
      control.push(this.fb.group({ type: value.type }));
    });
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
        selectElement.selectedIndex = 0; // Reset the select element
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

  get pokemonStrengths(): FormArray {
    return this.editPokemonForm.get('pokemonStrengths') as FormArray;
  }

  get pokemonWeaknesses(): FormArray {
    return this.editPokemonForm.get('pokemonWeaknesses') as FormArray;
  }

  onSubmit(): void {
    if (this.editPokemonForm.valid) {
      const formData = this.editPokemonForm.value;
      const pokemonDto = {
        id: +this.route.snapshot.paramMap.get('id')!,
        name: formData.name,
        type1: { typeName: formData.type1 },
        type2: { typeName: formData.type2 || null },
        pokemonWeaknesses: formData.pokemonWeaknesses.map((weakness: any) => ({
          type: { typeName: weakness.type.typeName }
        })),
        pokemonStrengths: formData.pokemonStrengths.map((strength: any) => ({
          type: { typeName: strength.type.typeName }
        }))
      };
  
      this.pokemonService.updatePokemon(pokemonDto.id, pokemonDto).subscribe(
        response => {
          console.log('Pokemon updated successfully:', response);
        },
        error => {
          console.error('Error updating Pokemon:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
}
