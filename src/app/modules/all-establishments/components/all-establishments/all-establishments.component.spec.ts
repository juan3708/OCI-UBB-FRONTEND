import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEstablishmentsComponent } from './all-establishments.component';

describe('AllEstablishmentsComponent', () => {
  let component: AllEstablishmentsComponent;
  let fixture: ComponentFixture<AllEstablishmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEstablishmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEstablishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
