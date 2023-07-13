import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingViedoComponent } from './marketing-viedo.component';

describe('MarketingViedoComponent', () => {
  let component: MarketingViedoComponent;
  let fixture: ComponentFixture<MarketingViedoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingViedoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingViedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
