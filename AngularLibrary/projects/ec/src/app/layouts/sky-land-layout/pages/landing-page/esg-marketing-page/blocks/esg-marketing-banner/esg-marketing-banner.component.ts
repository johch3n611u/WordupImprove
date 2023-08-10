import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PicsumImgService } from 'lib/public-api';

@Component({
  selector: 'ec-esg-marketing-banner',
  templateUrl: './esg-marketing-banner.component.html',
  styleUrls: ['./esg-marketing-banner.component.scss']
})
export class EsgMarketingBannerComponent implements OnInit {

  backgroundImg: string = '';

  constructor(
    private picsumImgService: PicsumImgService,
  ) {
    this.backgroundImg = `url('${picsumImgService.getImageUrl('3000')}')`;
  }

  ngOnInit(): void {
    this.startAnimation();
  }
  currentNumber = 0;
  targetNumber = 100;
  animationDuration = 1000; // in milliseconds
  animationStart!: number;
  animationId!: number;
  randomNumber: number = this.getRandomInt(50000) + 10000; //回傳0或1或2或3...或49
  fundNumber: number = 0;
  // 設置亂數規則
  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  startAnimation() {
    this.animationStart = performance.now();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  animate(now: number) {
    const timeElapsed = now - this.animationStart;
    const progress = Math.min(timeElapsed / this.animationDuration, 1);
    this.currentNumber = Math.floor(progress * this.randomNumber);

    if (timeElapsed < this.animationDuration) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
  }
}
