import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { gsap } from "gsap";

@Component({
  selector: 'bd-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @ViewChild("diver1", { read: ElementRef }) private _diver1: ElementRef | undefined = undefined;
  @ViewChild("diver2", { read: ElementRef }) private _diver2: ElementRef | undefined = undefined;
  @ViewChild("fish1", { read: ElementRef }) private _fish1: ElementRef | undefined = undefined;
  @ViewChild("fish2", { read: ElementRef }) private _fish2: ElementRef | undefined = undefined;

  ngAfterViewInit(): void {
    this.Part1Animation();
  }

  Part1Animation() {

    let switchbackOption = { repeat: -1, yoyo: true, repeatRefresh: true };
    let tl = gsap.timeline(switchbackOption);
    this.switchback(tl, this._diver1?.nativeElement, -2800, 2800);
    let tl2 = gsap.timeline(switchbackOption);
    this.switchback(tl2, this._diver2?.nativeElement, 2800, -2800);

    let tl3 = gsap.timeline(switchbackOption);
    this.switchback(tl3, this._fish1?.nativeElement, 2800, -2800);
    let tl4 = gsap.timeline(switchbackOption);
    this.switchback(tl4, this._fish2?.nativeElement, -2800, 2800);
  }

  switchback(tl: any, el: any, startX: any, endX: any) {
    tl
      .to(el, {
        x: startX,
        duration: () => { return this.getRand(25, 60) },
        y: () => { return this.getRand(0, 1000) },
        scale: () => { return this.getRand(1, 3) },
        delay: () => { return this.getRand(1, 5) }
      })
      .to(el, { duration: 1, rotateY: 180 })
      .to(el, {
        x: endX,
        duration: () => { return this.getRand(25, 40) },
        y: () => { return this.getRand(0, 1000) },
        scale: () => { return this.getRand(1, 3) },
        delay: () => { return this.getRand(1, 5) }
      });
  }

  getRand(min: any, max: any) {
    return Math.random() * (max - min) + min;
  }
}


