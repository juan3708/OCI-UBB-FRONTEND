import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHomepageComponent } from './contact-homepage.component';

describe('ContactHomepageComponent', () => {
  let component: ContactHomepageComponent;
  let fixture: ComponentFixture<ContactHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
