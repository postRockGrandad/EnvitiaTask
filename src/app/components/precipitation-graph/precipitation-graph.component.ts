import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'precipitation-graph',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './precipitation-graph.component.html',
  styleUrl: './precipitation-graph.component.css'
})
export class PrecipitationGraphComponent {
  @Input('data') data: Array<any>;
  @Input('container') graphContainer: ElementRef;
  graphWidth: number;


  ngOnInit() {
    this.graphWidth = (this.graphContainer?.nativeElement as HTMLElement).clientWidth;
  }
}
