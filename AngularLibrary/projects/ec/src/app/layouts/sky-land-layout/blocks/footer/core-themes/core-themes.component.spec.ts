import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreThemesComponent } from './core-themes.component';

describe('CoreThemesComponent', () => {
  let component: CoreThemesComponent;
  let fixture: ComponentFixture<CoreThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreThemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
