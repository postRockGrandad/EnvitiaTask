import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent {
  @Input('data') data: Array<any>;
  @Input('yAxisLabel') yAxisLabel: string;
  @Input('xAxisLabel') xAxisLabel: string;
  @Input('yMax') yMax: number;

  @Input('container') graphContainer: ElementRef;
  graphWidth: number;

  ngOnInit() {
    this.graphWidth = (this.graphContainer?.nativeElement as HTMLElement).clientWidth;
  }
}
