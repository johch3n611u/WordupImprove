import { Component } from '@angular/core';
import { PicsumImgService } from 'lib/public-api';

@Component({
  selector: 'ec-hero-images',
  templateUrl: './hero-images.component.html',
  styleUrls: ['./hero-images.component.scss']
})
export class HeroImagesComponent {
  constructor(
    private picsumImgService: PicsumImgService,
  ) {
    this.backgroundImg = `url('${picsumImgService.getImageUrl('3000', '3000', false)}')`;
  }

  backgroundImg: string = '';
}
