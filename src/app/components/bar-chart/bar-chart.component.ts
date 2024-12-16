import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnChanges {
  @Input('data') data: Array<{name: string, value: number}>;
  @Input('yAxisLabel') yAxisLabel: string;
  @Input('xAxisLabel') xAxisLabel: string;
  @Input('yMax') yMax: number;

  ngOnChanges(changes: SimpleChanges){
    if(changes['data'].currentValue?.length > 0) {
      this.data = changes['data'].currentValue.map((datapoint: {name: string, value: number}) => { 
        return { 
          name: datapoint.name,
          // ngx-charts throws hundreds of unhandled d3 js errors trying to tween animate values of 0 on graph-data-change
          //- pad 0s to 1e-20 
          //- resolves tweening issue but still shows value as 0 in graph 
          value: datapoint.value === 0 ?  1e-20 : datapoint.value
        }; 
      });
    } 
  }
}
