import { Component, ElementRef, ViewChild } from '@angular/core';
import { gsap } from "gsap";

@Component({
  selector: 'bd-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @ViewChild("Img1") private _Img1: ElementRef | undefined = undefined;
  @ViewChild("Img2") private _Img2: ElementRef | undefined = undefined;
  @ViewChild("Img3") private _Img3: ElementRef | undefined = undefined;
  @ViewChild("Img4") private _Img4: ElementRef | undefined = undefined;

  ngAfterViewInit(): void {
    this.Part1Animation();
  }

  Part1Animation() {
    var tl = gsap.timeline();
    var tl2 = gsap.timeline();
    var tl3 = gsap.timeline();
    var tl4 = gsap.timeline();
    tl.to(this._Img2?.nativeElement, { duration: 2, x: 634, y: 57, opacity: 1, ease: "bounce" });
    tl.to(this._Img3?.nativeElement, { duration: 2, x: 276, y: 290, opacity: 1, ease: "bounce" });
    tl.to(this._Img4?.nativeElement, { duration: 2, x: 178, y: 77, opacity: 1, ease: "bounce" });
    tl2.to(this._Img2?.nativeElement, { duration: 2, opacity: 0.2, delay: 7 });
    tl3.to(this._Img3?.nativeElement, { duration: 2, opacity: 0.2, delay: 7 });
    tl4.to(this._Img4?.nativeElement, { duration: 2, opacity: 0.2, delay: 7 });
    tl.to(this._Img1?.nativeElement, { duration: 2, x: 430, y: 255, opacity: 1, scale: 1.7, ease: "bounce", delay: 2 });
  }
}
