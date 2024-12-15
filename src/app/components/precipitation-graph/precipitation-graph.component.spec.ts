import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecipitationGraphComponent } from './precipitation-graph.component';

describe('PrecipitationGraphComponent', () => {
  let component: PrecipitationGraphComponent;
  let fixture: ComponentFixture<PrecipitationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecipitationGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecipitationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
