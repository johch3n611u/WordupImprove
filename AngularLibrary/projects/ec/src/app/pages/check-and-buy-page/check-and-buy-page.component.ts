import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ec-check-and-buy-page',
  templateUrl: './check-and-buy-page.component.html',
  styleUrls: ['./check-and-buy-page.component.scss']
})
export class CheckAndBuyPageComponent {

  promotional = [{}, {}];
  products = [{}, {}, {}];
  template: any;
  navigationSub$: any;
  @ViewChild('bag', { static: true }) bag: TemplateRef<any> | undefined;
  @ViewChild('check', { static: true }) check: TemplateRef<any> | undefined;

  constructor(private router: Router) {
    // https://blog.csdn.net/xuehu837769474/article/details/104763685
    // Router 同頁重載
    this.navigationSub$ = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // this.template = this.bag;
        this.template = this.check;
      }
    });
  }

  ngAfterContentInit(): void {
    // this.template = this.bag;
    this.template = this.check;
  }

  ngOnDestroy(): void {
    this.navigationSub$.unsubscribe();
  }
}
