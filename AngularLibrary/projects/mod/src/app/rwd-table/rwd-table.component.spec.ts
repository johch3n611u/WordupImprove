import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RwdTableComponent } from './rwd-table.component';

describe('RwdTableComponent', () => {
  let component: RwdTableComponent;
  let fixture: ComponentFixture<RwdTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RwdTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RwdTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
