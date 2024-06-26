import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonType } from '../shared/models/pokemon.model';
import { Pokemon } from '../shared/models/pokemon.model';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  addPokemonForm: FormGroup;
  types: PokemonType[] = [];

  constructor(private fb: FormBuilder, private pokemonService: PokemonService) {
    this.addPokemonForm = this.fb.group({
      name: ['', Validators.required],
      type1: ['', Validators.required],
      type2: [''],
      pokemonStrengths: this.fb.array([]), // You'll need to handle strengths and weaknesses
      pokemonWeaknesses: this.fb.array([]) // using FormArray for dynamic lists
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

  onSubmit(): void {
    if (this.addPokemonForm.valid) {
      const formData = this.addPokemonForm.value;
      const pokemon: Pokemon = {
        id: 0, // Assuming ID will be assigned by the backend
        name: formData.name,
        type1: {
          typeName: formData.type1,
          id: 0
        },
        type2: formData.type2 ? { typeName: formData.type2, id: 0 } : undefined,
        pokemonStrengths: formData.pokemonStrengths, // Adjust as per your form structure
        pokemonWeaknesses: formData.pokemonWeaknesses // Adjust as per your form structure
      };

      // Call your service method to save the Pokemon
      this.pokemonService.addPokemon(pokemon).subscribe(
        response => {
          console.log('Pokemon added successfully:', response);
          // Optionally, you can reset the form after successful submission
          this.addPokemonForm.reset();
        },
        error => {
          console.error('Error adding Pokemon:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
}
