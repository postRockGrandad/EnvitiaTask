import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-carousel.component.html',
  styleUrl: './text-carousel.component.css'
})
export class TextCarouselComponent {
  @Input('data') carouselData: Array<string> = [];
  carouselIndex: number = 0;

  next(): void {
    if(this.carouselIndex < this.carouselData?.length -1) {
      this.carouselIndex++;
    } else {
      this.carouselIndex = 0;
    }
  }

  prev(): void {
    if(this.carouselIndex > 0) {
      this.carouselIndex--;
    } else {
      this.carouselIndex = this.carouselData?.length -1;
    }
  }
}
