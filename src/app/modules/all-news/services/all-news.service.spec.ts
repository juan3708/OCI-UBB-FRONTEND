import { TestBed } from '@angular/core/testing';

import { AllNewsService } from './all-news.service';

describe('AllNewsService', () => {
  let service: AllNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
