import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonType } from '../shared/models/pokemon.model';
import { CommonModule } from '@angular/common';
import { ImageSelectionModalComponent } from '../components/image-selection-modal/image-selection-modal.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, ImageSelectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class EditComponent implements OnInit {
  @ViewChild(ImageSelectionModalComponent) imagePickerModal!: ImageSelectionModalComponent;
  editPokemonForm: FormGroup;
  types: PokemonType[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  pokemonId!: number;
  selectedImageUrl: string | null = null;;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) {
    this.editPokemonForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type1: [null, Validators.required],
      type2: [null],
      details: [''],
      pokemonStrengths: this.fb.array([]),
      pokemonWeaknesses: this.fb.array([]),
      imageUrl: ['']
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
              type2: pokemon.type2,
              details: pokemon.details,
              imageUrl: pokemon.imageUrl 
            });

            // Populate strengths and weaknesses
            this.setFormArray('pokemonStrengths', pokemon.pokemonStrengths);
            this.setFormArray('pokemonWeaknesses', pokemon.pokemonWeaknesses);
            this.selectedImageUrl = pokemon.imageUrl ?? null;
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

  openImageModal(): void {
    if (this.imagePickerModal) {
      this.imagePickerModal.open();
    }
  }

  onImageSelected(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.editPokemonForm.patchValue({ imageUrl });    
  }

  onModalClosed(): void {
  }

  removeImage() {
    this.selectedImageUrl = null; 
    this.editPokemonForm.patchValue({ imageUrl: null });
  }

  onSubmit(): void {
    if (this.editPokemonForm.valid) {
      const formData = this.editPokemonForm.value;
      const pokemonDto = {
        id: +this.route.snapshot.paramMap.get('id')!,
        name: formData.name,
        type1: { typeName: formData.type1 },
        type2: formData.type2 && formData.type2 !== 'None' ? this.types.find(type => type.typeName === formData.type2) : undefined,
        pokemonWeaknesses: formData.pokemonWeaknesses.map((weakness: any) => ({
          type: { typeName: weakness.type.typeName }
        })),
        pokemonStrengths: formData.pokemonStrengths.map((strength: any) => ({
          type: { typeName: strength.type.typeName }
        })),
        details: formData.details,
        imageUrl: formData.imageUrl
      };

      this.pokemonService.updatePokemon(pokemonDto.id, pokemonDto).subscribe(
        response => {
          console.log('Pokemon updated successfully:', response);
          this.successMessage = 'Pokemon updated successfully!';
          this.errorMessage = ''; // Clear any previous error messages
          setTimeout(() => {
            this.router.navigate([`/pokemon/${pokemonDto.name}`]);
          }, 1000);
        },
        error => {
          console.error('Error updating Pokemon:', error);
          this.successMessage = ''; // Clear any previous success messages
          this.errorMessage = `Error updating Pokemon ${error.message || 'An unexpected error occurred.'}`;
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
      this.successMessage = ''; // Clear any previous success messages
      this.errorMessage = 'Please correct the errors in the form before submitting.';
    }
  }
}
