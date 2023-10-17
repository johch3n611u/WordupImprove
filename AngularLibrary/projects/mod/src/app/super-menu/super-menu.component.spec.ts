import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperMenuComponent } from './super-menu.component';

describe('SuperMenuComponent', () => {
  let component: SuperMenuComponent;
  let fixture: ComponentFixture<SuperMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
