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
  @Input('data') data: Array<{[key in string]: any}>;
  @Input('dataXKey') xKey: string;
  @Input('dataYKey') yKey: string;
  @Input('yAxisLabel') yAxisLabel: string;
  @Input('xAxisLabel') xAxisLabel: string;
  @Input('yMax') yMax: number;

  ngOnChanges(changes: SimpleChanges){
    //re-structure data for graph on each input change
    if(changes['data'].currentValue?.length > 0) {
      this.data = changes['data'].currentValue.map((datapoint: {[key in string]: any}) => { 
        return { 
          name: datapoint[this.xKey],
          // ngx-charts throws unhandled d3 js errors trying to tween-animate from values of 0 on graph-data change
          //- pad 0s to 1e-20 
          //-- resolves tweening issue but still rounds to 0 in graph 
          value: datapoint[this.yKey] === 0 ?  1e-20 : datapoint[this.yKey] 
        }; 
      });
    } 
  }
}
