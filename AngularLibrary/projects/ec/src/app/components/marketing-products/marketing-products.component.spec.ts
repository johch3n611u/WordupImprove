import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingProductsComponent } from './marketing-products.component';

describe('MarketingProductsComponent', () => {
  let component: MarketingProductsComponent;
  let fixture: ComponentFixture<MarketingProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
