import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

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

open(): void {
  this.isOpen = true;
  // Load images if needed (we will implement this later)
}

close(): void {
  this.isOpen = false;
}

selectImage(imageUrl: string): void {
  this.imageSelected.emit(imageUrl);
  this.close();
}
}