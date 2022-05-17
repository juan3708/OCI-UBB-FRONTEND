import { TestBed } from '@angular/core/testing';

import { StudentsCandidatesService } from './students-candidates.service';

describe('StudentsCandidatesService', () => {
  let service: StudentsCandidatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsCandidatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
