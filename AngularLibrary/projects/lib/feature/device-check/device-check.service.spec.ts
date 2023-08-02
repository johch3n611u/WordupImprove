import { TestBed } from '@angular/core/testing';

import { DeviceCheckService } from './device-check.service';

describe('DeviceCheckService', () => {
  let service: DeviceCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
