import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsHomepageComponent } from './news-homepage.component';

describe('NewsHomepageComponent', () => {
  let component: NewsHomepageComponent;
  let fixture: ComponentFixture<NewsHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
