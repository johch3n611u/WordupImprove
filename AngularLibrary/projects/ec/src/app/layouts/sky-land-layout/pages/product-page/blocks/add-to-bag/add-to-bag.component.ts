import { Component } from '@angular/core';
import { DeviceCheckService } from 'lib/public-api';

@Component({
  selector: 'ec-add-to-bag',
  templateUrl: './add-to-bag.component.html',
  styleUrls: ['./add-to-bag.component.scss']
})
export class AddToBagComponent {
  constructor(
    public deviceCheckService: DeviceCheckService,
  )
  {

  }
}
