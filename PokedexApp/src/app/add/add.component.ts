import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { ImageSelectionModalComponent } from '../components/image-selection-modal/image-selection-modal.component';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [CommonModule, ReactiveFormsModule, AppComponent, ImageSelectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})

export class AddComponent implements OnInit{
  @ViewChild(ImageSelectionModalComponent) imagePickerModal!: ImageSelectionModalComponent;
  types: PokemonType[] = [];
  addPokemonForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  pokemons: any;
  selectedImageUrl: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private fb: FormBuilder,
    private router : Router) {
    this.addPokemonForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type1: ['', Validators.required],
      type2: [''],
      details: [''],
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
        console.error('Error fetching types:', error);
        alert('Failed to fetch types. Please check the console for details.');
      }
    );  }

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
        selectElement.selectedIndex = 0; 
      }
    }
  }

  removeWeakness(index: number): void {
    this.pokemonWeaknesses.removeAt(index);
  }

  openImagePicker(): void {
    if (this.imagePickerModal) {
      this.imagePickerModal.open(); 
    } else {
      console.error('ImagePickerModalComponent is not available.');
    }
  }

  onImageSelected(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  removeImage() {
    this.selectedImageUrl = null; 
    this.addPokemonForm.patchValue({ imageUrl: null });
  }

  onSubmit(): void {
    if (this.addPokemonForm.valid) {
      const formData = this.addPokemonForm.value;
      const pokemon: Pokemon = {
        id: 0,
        name: formData.name,
        type1: this.types.find(type => type.typeName === formData.type1)!,
        type2: formData.type2 && formData.type2 !== 'None' ? this.types.find(type => type.typeName === formData.type2) : undefined,
        details: formData.details,
        pokemonStrengths: formData.pokemonStrengths.map((strength: any) => ({
          type: strength.type
        })),
        pokemonWeaknesses: formData.pokemonWeaknesses.map((weakness: any) => ({
          type: weakness.type
        })),
        imageUrl: this.selectedImageUrl ?? undefined 

      };

      this.pokemonService.addPokemon(pokemon).subscribe(
        response => {
          this.successMessage = 'Pokemon successfully saved.';
          this.errorMessage = ''; 
          this.addPokemonForm.reset();
          setTimeout(() => {
            this.router.navigate([`/pokemon/${pokemon.name}`]);
          }, 1000);
        },
        error => {
          this.successMessage = ''; 
          this.errorMessage = `Error updating Pokemon ${error.message || 'An unexpected error occurred.'}`;
        }
      );
    } else {
      this.errorMessage = 'This form is invalid. Cannot submit.';
      this.successMessage = ''; 
    }
  }
}