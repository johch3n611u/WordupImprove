import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColumnLayoutComponent } from './single-column-layout.component';

describe('SingleColumnLayoutComponent', () => {
  let component: SingleColumnLayoutComponent;
  let fixture: ComponentFixture<SingleColumnLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleColumnLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleColumnLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
