import { Component } from '@angular/core';
import { PicsumImgService } from 'lib/public-api';

@Component({
  selector: 'ec-marketing-video',
  templateUrl: './marketing-video.component.html',
  styleUrls: ['./marketing-video.component.scss']
})
export class MarketingVideoComponent {
  constructor(
    private picsumImgService: PicsumImgService,
  ) {
    this.backgroundImg = `url('${picsumImgService.getImageUrl('3000')}')`;
  }

  backgroundImg: string = '';
}
