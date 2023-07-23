import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgMarketingBannerComponent } from './esg-marketing-banner.component';

describe('EsgMarketingBannerComponent', () => {
  let component: EsgMarketingBannerComponent;
  let fixture: ComponentFixture<EsgMarketingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgMarketingBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgMarketingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
