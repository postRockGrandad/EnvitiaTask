import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastSearchFormComponent } from './forecast-search-form.component';

describe('ForecastSearchFormComponent', () => {
  let component: ForecastSearchFormComponent;
  let fixture: ComponentFixture<ForecastSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastSearchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForecastSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
