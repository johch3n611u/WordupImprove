import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgMarketingComponent } from './esg-marketing.component';

describe('EsgMarketingComponent', () => {
  let component: EsgMarketingComponent;
  let fixture: ComponentFixture<EsgMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgMarketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
