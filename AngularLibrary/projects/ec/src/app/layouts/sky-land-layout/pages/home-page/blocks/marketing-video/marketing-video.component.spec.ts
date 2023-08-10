import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingVideoComponent } from './marketing-video.component';

describe('MarketingVideoComponent', () => {
  let component: MarketingVideoComponent;
  let fixture: ComponentFixture<MarketingVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
