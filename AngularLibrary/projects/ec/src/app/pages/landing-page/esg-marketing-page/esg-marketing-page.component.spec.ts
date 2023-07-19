import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgMarketingPageComponent } from './esg-marketing-page.component';

describe('EsgMarketingPageComponent', () => {
  let component: EsgMarketingPageComponent;
  let fixture: ComponentFixture<EsgMarketingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgMarketingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgMarketingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
