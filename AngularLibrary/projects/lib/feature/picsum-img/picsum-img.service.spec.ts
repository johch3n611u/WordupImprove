import { TestBed } from '@angular/core/testing';

import { PicsumImgService } from './picsum-img.service';

describe('PicsumImgService', () => {
  let service: PicsumImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicsumImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
