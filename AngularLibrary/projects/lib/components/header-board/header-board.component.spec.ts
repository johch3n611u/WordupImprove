import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBoardComponent } from './header-board.component';

describe('HeaderBoardComponent', () => {
  let component: HeaderBoardComponent;
  let fixture: ComponentFixture<HeaderBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
