import { Component, Input } from '@angular/core';
import { superMenuModal } from './superMenuModal';

@Component({
  selector: 'm-ec-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  @Input()
  Title!: string;
  @Input()
  MenuList?: superMenuModal[];

}
