import { TestBed } from '@angular/core/testing';

import { AllStudentsService } from './all-students.service';

describe('AllStudentsService', () => {
  let service: AllStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
