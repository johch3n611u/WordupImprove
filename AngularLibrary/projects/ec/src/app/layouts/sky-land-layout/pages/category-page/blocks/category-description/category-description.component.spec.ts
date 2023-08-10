import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDescriptionComponent } from './category-description.component';

describe('CategoryDescriptionComponent', () => {
  let component: CategoryDescriptionComponent;
  let fixture: ComponentFixture<CategoryDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
