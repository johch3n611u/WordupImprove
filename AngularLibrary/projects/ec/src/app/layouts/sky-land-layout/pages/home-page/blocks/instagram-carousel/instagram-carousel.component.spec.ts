import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramCarouselComponent } from './instagram-carousel.component';

describe('InstagramCarouselComponent', () => {
  let component: InstagramCarouselComponent;
  let fixture: ComponentFixture<InstagramCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
