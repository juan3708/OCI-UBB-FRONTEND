import { TestBed } from '@angular/core/testing';

import { AllTeachersService } from './all-teachers.service';

describe('AllTeachersService', () => {
  let service: AllTeachersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllTeachersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
