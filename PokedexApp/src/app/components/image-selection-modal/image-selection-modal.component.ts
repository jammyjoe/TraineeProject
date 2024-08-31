import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-image-selection-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-selection-modal.component.html',
  styleUrl: './image-selection-modal.component.css'
})

export class ImageSelectionModalComponent {
  @Output() imageSelected = new EventEmitter<string>();
  isOpen = false;
  images: { url: string, name: string }[] = [];

  constructor(private pokemonService: PokemonService) {}

  open(): void {
    this.isOpen = true;
    this.loadImages(); 
  }

  close(): void {
    this.isOpen = false;
  }

  selectImage(imageUrl: string): void {
    this.imageSelected.emit(imageUrl);
    this.close();
  }

  loadImages(): void {
    this.pokemonService.getPokemonImages().subscribe(
      images => {
        console.log('Images loaded:', images); // Debugging line
        this.images = images;
      },
      error => console.error('Error loading images:', error)
    );
  }
}