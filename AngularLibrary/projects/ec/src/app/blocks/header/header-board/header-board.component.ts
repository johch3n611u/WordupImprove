import { Component } from '@angular/core';
import { PanelService } from '../panel/panel.service';

@Component({
  selector: 'ec-header-board',
  templateUrl: './header-board.component.html',
  styleUrls: ['./header-board.component.scss']
})
export class HeaderBoardComponent {

  constructor(
    public panelService: PanelService,
  ) { }
}
