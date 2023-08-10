import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyLandLayoutComponent } from './sky-land-layout.component';

describe('SkyLandLayoutComponent', () => {
  let component: SkyLandLayoutComponent;
  let fixture: ComponentFixture<SkyLandLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyLandLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyLandLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
