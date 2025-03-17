// todo: https://css-tricks.com/scale-svg/

import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-svg[src]',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent {

  @Input() src: any;
  @Input() svgClass: any;
  @Input() width: any;
  @Input() height: any;
  @Input() boxStyle: any;
  svgContent: any;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.setSvg();
  }

  setSvg() {
    this.httpClient.get(this.src, { responseType: 'text' }).subscribe(
      res => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(res, 'image/svg+xml');
        doc.documentElement.setAttribute('preserveAspectRatio', 'none');
        doc.documentElement.setAttribute('class', this.svgClass);
        // doc.documentElement.setAttribute('viewBox', '0 0 100 100');
        doc.documentElement.setAttribute('width', this.width === undefined ? '100%' : this.width);
        doc.documentElement.setAttribute('height', this.height === undefined ? '100%' : this.height);
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(doc.documentElement.outerHTML);
      }
    )
  }

  previousInputs: {
    svgClass: string;
    width: string;
    height: string;
    boxStyle: string;
    src: string;
  } | any = {};

  ngDoCheck() {
    if (
      this.svgClass !== this.previousInputs.svgClass ||
      this.width !== this.previousInputs.width ||
      this.height !== this.previousInputs.height ||
      this.boxStyle !== this.previousInputs.boxStyle ||
      this.src !== this.previousInputs.src
    ) {
      // 在这里添加你想要执行的动作
      this.setSvg();
      // 更新previousInputs对象，将当前的输入参数值保存起来
      this.previousInputs = {
        svgClass: this.svgClass,
        width: this.width,
        height: this.height,
        boxStyle: this.boxStyle,
        src: this.src
      };
    }
  }
}
