import { Component, ContentChild, ContentChildren, ElementRef, Optional, QueryList, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'lib-wrapper',
  // templateUrl: './wrapper.component.html',
  template: `
  <div>wrapper works!</div>
  <h2>ng-content with select</h2>
  <ng-content select="[first]" ></ng-content>
  <h2>ngTemplateOutlet</h2>
  <ng-template [ngTemplateOutlet]="firstTemplateRef"></ng-template>
  <h2>ng-content</h2>
  <p>如果有 select 屬性則指定渲染，如無則全都塞在最後一個 ng-content</p>
  <ng-content></ng-content>
  <h2>ngViewOutlet</h2>
  <div *ngFor="let templateRef of allTemplateRef">
    <ng-template [ngTemplateOutlet]="templateRef"></ng-template>
  </div>
  `,
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {

  constructor(
    @Optional() private viewContainerRef: ViewContainerRef,
    @Optional() private templateRef: TemplateRef<any>,
    @Optional() private elementRef: ElementRef<any>,
  ) {
    console.log('viewContainerRef', this.viewContainerRef);
    // ViewContainerRef：表示一個視圖容器，可以用來創建、插入和移除動態組件。通過 ViewContainerRef，可以動態創建一個子視圖並將其插入到容器中。例如，可以通過 ViewContainerRef.createComponent 方法動態創建一個組件，然後通過 ViewContainerRef.insert 方法將它插入到容器中。ViewContainerRef 可以在組件中通過 @ViewChild 或 @ViewChildren 裝飾器進行注入。
    console.log('templateRef', this.templateRef);
    // TemplateRef：表示一個模板的引用，可以用來動態創建和渲染模板。通過 TemplateRef.createEmbeddedView 方法可以動態創建一個嵌入式視圖（Embedded View），然後使用 ViewContainerRef.createEmbeddedView 方法將其插入到視圖容器中。TemplateRef 通常用於實現可重複使用的組件或動態生成模板的場景。TemplateRef 可以在組件中通過 @ViewChild 或 @ContentChild 裝飾器進行注入。
    console.log('elementRef', this.elementRef);
    // ElementRef：表示一個 DOM 元素的引用，可以用來操作和訪問該元素的屬性和方法。通過 ElementRef.nativeElement 屬性可以獲取到該元素的 DOM 對象。例如，可以使用 ElementRef.nativeElement.style 屬性來設置元素的樣式。ElementRef 可以在組件中通過 @ViewChild 或 @ViewChildren 裝飾器進行注入。
  }

  @ContentChild(TemplateRef) firstTemplateRef: TemplateRef<any> | null = null;
  // 要指定 element or object or class 才能撈的到 ContentChildren
  // @ContentChildren('*') allContentEls: QueryList<any> | undefined;
  @ContentChildren(TemplateRef) allTemplateRef: QueryList<any> | undefined;

  ngAfterContentInit() {
    console.log('firstTemplateRef', this.firstTemplateRef);
    console.log('allTemplateRef', this.allTemplateRef);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
