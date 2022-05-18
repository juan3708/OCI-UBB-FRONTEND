import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedHomepageComponent } from './featured-homepage.component';

describe('FeaturedHomepageComponent', () => {
  let component: FeaturedHomepageComponent;
  let fixture: ComponentFixture<FeaturedHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
