import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsCarouselComponent } from './awards-carousel.component';

describe('AwardsCarouselComponent', () => {
  let component: AwardsCarouselComponent;
  let fixture: ComponentFixture<AwardsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardsCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
