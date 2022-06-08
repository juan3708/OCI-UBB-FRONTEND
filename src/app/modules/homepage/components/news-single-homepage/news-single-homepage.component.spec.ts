import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSingleHomepageComponent } from './news-single-homepage.component';

describe('NewsSingleHomepageComponent', () => {
  let component: NewsSingleHomepageComponent;
  let fixture: ComponentFixture<NewsSingleHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsSingleHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSingleHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
