import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectionModalComponent } from './image-selection-modal.component';

describe('ImageSelectionModalComponent', () => {
  let component: ImageSelectionModalComponent;
  let fixture: ComponentFixture<ImageSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
