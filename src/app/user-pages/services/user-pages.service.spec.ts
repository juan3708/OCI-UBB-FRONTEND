import { TestBed } from '@angular/core/testing';

import { UserPagesService } from './user-pages.service';

describe('UserPagesService', () => {
  let service: UserPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
