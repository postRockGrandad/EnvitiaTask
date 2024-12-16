import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'tab-navigation',
  standalone: true,
  imports: [CommonModule, NgFor, NgbNavModule],
  templateUrl: './tab-navigation.component.html',
  styleUrl: './tab-navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabNavigationComponent {
  @Input('navTitles') navTitles: Array<string>;
  @Input('navTemplates') navTemplates: Array<TemplateRef<any>>;
  @Input('navContext') navContext: { [key in string]: any };

  activeTab: number = 1;
}
