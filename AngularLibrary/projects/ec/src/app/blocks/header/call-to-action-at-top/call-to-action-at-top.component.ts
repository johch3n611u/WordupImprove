import { Component, Input } from '@angular/core';

@Component({
  selector: 'ec-call-to-action-at-top',
  templateUrl: './call-to-action-at-top.component.html',
  styleUrls: ['./call-to-action-at-top.component.scss']
})
export class CallToActionAtTopComponent {
  @Input() data: any = {};

  ngOnInit(): void {
    // console.log(this.data);
  }
}
