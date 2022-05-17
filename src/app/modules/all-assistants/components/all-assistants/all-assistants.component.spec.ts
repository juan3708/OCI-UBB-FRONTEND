import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAssistantsComponent } from './all-assistants.component';

describe('AllAssistantsComponent', () => {
  let component: AllAssistantsComponent;
  let fixture: ComponentFixture<AllAssistantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAssistantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAssistantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
