import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordupImproveComponent } from './wordup-improve.component';

describe('WordupImproveComponent', () => {
  let component: WordupImproveComponent;
  let fixture: ComponentFixture<WordupImproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordupImproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordupImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
