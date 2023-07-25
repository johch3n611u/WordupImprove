import { Component, Input } from '@angular/core';

@Component({
  selector: 'ec-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() data: any = {};
  ngOnInit(): void {
    console.log(this.data.leftNav);
  }
}
