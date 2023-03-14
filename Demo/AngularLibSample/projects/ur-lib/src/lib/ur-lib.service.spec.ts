import { TestBed } from '@angular/core/testing';

import { UrLibService } from './ur-lib.service';

describe('UrLibService', () => {
  let service: UrLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
