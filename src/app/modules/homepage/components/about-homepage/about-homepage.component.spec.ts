import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHomepageComponent } from './about-homepage.component';

describe('AboutHomepageComponent', () => {
  let component: AboutHomepageComponent;
  let fixture: ComponentFixture<AboutHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
