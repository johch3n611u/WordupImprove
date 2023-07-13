import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingArticlesComponent } from './marketing-articles.component';

describe('MarketingArticlesComponent', () => {
  let component: MarketingArticlesComponent;
  let fixture: ComponentFixture<MarketingArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
