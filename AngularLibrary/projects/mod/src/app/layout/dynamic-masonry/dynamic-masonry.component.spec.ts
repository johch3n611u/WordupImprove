import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMasonryComponent } from './dynamic-masonry.component';

describe('DynamicMasonryComponent', () => {
  let component: DynamicMasonryComponent;
  let fixture: ComponentFixture<DynamicMasonryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicMasonryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
