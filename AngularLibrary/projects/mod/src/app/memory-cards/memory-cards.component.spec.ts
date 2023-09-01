import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryCardsComponent } from './memory-cards.component';

describe('MemoryCardsComponent', () => {
  let component: MemoryCardsComponent;
  let fixture: ComponentFixture<MemoryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoryCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
