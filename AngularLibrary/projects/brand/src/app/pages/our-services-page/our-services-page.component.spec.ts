import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurServicesPageComponent } from './our-services-page.component';

describe('OurServicesPageComponent', () => {
  let component: OurServicesPageComponent;
  let fixture: ComponentFixture<OurServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurServicesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
