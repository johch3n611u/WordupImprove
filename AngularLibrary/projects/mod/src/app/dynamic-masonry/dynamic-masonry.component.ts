import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-masonry',
  templateUrl: './dynamic-masonry.component.html',
  styleUrls: ['./dynamic-masonry.component.scss']
})
export class DynamicMasonryComponent {

  @ViewChild('columns') columnsEle: ElementRef = {} as ElementRef;
  @ViewChild('flex') flexEle: ElementRef = {} as ElementRef;
  @ViewChild('grid') gridEle: ElementRef = {} as ElementRef;

  template: any;
  masonry = '';
  brick = '';
  items = [
    { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }
  ];

  ngOnInit(): void {
    this.items.forEach(item => item.color = this.GetRandomColor());
  }

  GetRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "background-color:#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + ';';
  }
}
