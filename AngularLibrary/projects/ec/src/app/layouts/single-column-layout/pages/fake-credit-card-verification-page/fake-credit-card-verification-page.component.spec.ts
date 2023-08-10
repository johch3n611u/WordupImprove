import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeCreditCardVerificationPageComponent } from './fake-credit-card-verification-page.component';

describe('FakeCreditCardVerificationPageComponent', () => {
  let component: FakeCreditCardVerificationPageComponent;
  let fixture: ComponentFixture<FakeCreditCardVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakeCreditCardVerificationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeCreditCardVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
