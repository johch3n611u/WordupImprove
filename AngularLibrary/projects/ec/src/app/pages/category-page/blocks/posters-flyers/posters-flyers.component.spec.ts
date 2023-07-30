import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostersFlyersComponent } from './posters-flyers.component';

describe('PostersFlyersComponent', () => {
  let component: PostersFlyersComponent;
  let fixture: ComponentFixture<PostersFlyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostersFlyersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostersFlyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
