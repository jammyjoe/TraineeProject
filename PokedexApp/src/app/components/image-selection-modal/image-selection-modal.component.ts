import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-image-selection-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-selection-modal.component.html',
  styleUrl: './image-selection-modal.component.css'
})

export class ImageSelectionModalComponent implements OnInit {
  @Output() imageSelected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();
  isOpen = false;
  images: { url: string, name: string }[] = [];

  constructor(private pokemonService: PokemonService) { }
  
  ngOnInit(): void {
    this.loadImages();
  }


  open(): void {
    this.isOpen = true;
    this.loadImages(); 
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit(); // Emit event when the modal is closed
  }

  selectImage(imageUrl: string): void {
    this.imageSelected.emit(imageUrl);
    this.close();
  }

  loadImages(): void {
    this.pokemonService.getPokemonImages().subscribe(
      images => this.images = images,
      error => console.error('Error loading images:', error)
    );
  }
}