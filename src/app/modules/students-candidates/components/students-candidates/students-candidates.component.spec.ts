import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsCandidatesComponent } from './students-candidates.component';

describe('StudentsCandidatesComponent', () => {
  let component: StudentsCandidatesComponent;
  let fixture: ComponentFixture<StudentsCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsCandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
