import { TestBed } from '@angular/core/testing';

import { AllAssistantsService } from './all-assistants.service';

describe('AllAssistantsService', () => {
  let service: AllAssistantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllAssistantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
