import { TestBed } from '@angular/core/testing';

import { AllEstablishmentsService } from './all-establishments.service';

describe('AllEstablishmentsService', () => {
  let service: AllEstablishmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllEstablishmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
