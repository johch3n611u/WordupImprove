import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaMenuTabsComponent } from './mega-menu-tabs.component';

describe('MegaMenuTabsComponent', () => {
  let component: MegaMenuTabsComponent;
  let fixture: ComponentFixture<MegaMenuTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MegaMenuTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MegaMenuTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
