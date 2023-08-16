import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
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
  @ViewChild("fish3", { read: ElementRef }) private _fish3: ElementRef | undefined = undefined;
  @ViewChild("ink", { read: ElementRef }) private _ink: ElementRef | undefined = undefined;
  @ViewChild("sharkMouth", { read: ElementRef }) private _sharkMouth: ElementRef | undefined = undefined;
  isMixBlendModeDf = false;

  constructor(
    private router: Router
  ) {

  }

  ngAfterViewInit(): void {
    this.Part1Animation();
    this.Part2Animation();
  }

  Part1Animation() {
    let switchbackOption = { repeat: -1, yoyo: true, repeatRefresh: true };
    let tl = gsap.timeline(switchbackOption);
    this.switchback(tl, this._diver1?.nativeElement, -3500, 3500);
    let tl2 = gsap.timeline(switchbackOption);
    this.switchback(tl2, this._diver2?.nativeElement, 3500, -3500);

    let tl3 = gsap.timeline(switchbackOption);
    this.switchback(tl3, this._fish1?.nativeElement, 3500, -3500);
    let tl4 = gsap.timeline(switchbackOption);
    this.switchback(tl4, this._fish2?.nativeElement, -3500, 3500);
  }

  switchback(tl: any, el: any, startX: any, endX: any) {
    tl
      .to(el, {
        x: startX,
        duration: () => { return this.getRand(25, 60) },
        y: () => { return this.getRand(0, 1000) },
        scale: () => { return this.getRand(1, 3) },
        delay: () => { return this.getRand(1, 5) },
        opacity: 0
      })
      .to(el, { duration: 1, rotateY: 180 })
      .to(el, {
        x: endX,
        duration: () => { return this.getRand(25, 40) },
        y: () => { return this.getRand(0, 1000) },
        scale: () => { return this.getRand(1, 3) },
        delay: () => { return this.getRand(1, 5) },
        opacity: 0
      })
      .to(el, { duration: 1, rotateY: 180 });
  }

  getRand(min: any, max: any) {
    return Math.random() * (max - min) + min;
  }

  Part2Animation() {
    let tl = gsap.timeline({ repeat: -1 });
    let fish3 = this._fish3?.nativeElement;
    let ink = this._ink?.nativeElement;
    let xPath = this.getRand(0, 1000);
    let delay = this.getRand(0, 30);
    let fishLeaveAndInk = 8;

    tl
      .to(fish3, { duration: fishLeaveAndInk, opacity: 1, x: xPath, y: -800, delay: delay })
      .to(ink, { x: xPath, duration: 1, opacity: 1, scale: 3, })
      .to(ink, { duration: 10, opacity: 0, scale: 0, })
      .to(fish3, { x: xPath + 500, duration: 3, opacity: 0, y: -2800, delay: delay }, fishLeaveAndInk);
  }

  Part3Animation() {
    let tl = gsap.timeline();
    let sharkMouth = this._sharkMouth?.nativeElement;
    this.isMixBlendModeDf = true;
    tl.to(sharkMouth, {
      scale: 5, duration: 8, opacity: 1, onComplete: () => {
        this.router.navigate(['aboutUs']);
      }
    });
  }
}


