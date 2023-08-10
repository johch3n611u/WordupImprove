import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAndBuyPageComponent } from './check-and-buy-page.component';

describe('CheckAndBuyPageComponent', () => {
  let component: CheckAndBuyPageComponent;
  let fixture: ComponentFixture<CheckAndBuyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckAndBuyPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAndBuyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
