import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallToActionAtTopComponent } from './call-to-action-at-top.component';

describe('CallToActionAtTopComponent', () => {
  let component: CallToActionAtTopComponent;
  let fixture: ComponentFixture<CallToActionAtTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallToActionAtTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallToActionAtTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
