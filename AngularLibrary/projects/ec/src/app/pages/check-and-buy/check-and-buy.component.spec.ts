import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAndBuyComponent } from './check-and-buy.component';

describe('CheckAndBuyComponent', () => {
  let component: CheckAndBuyComponent;
  let fixture: ComponentFixture<CheckAndBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckAndBuyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAndBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
