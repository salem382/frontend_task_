import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureslayoutComponent } from './featureslayout.component';

describe('FeatureslayoutComponent', () => {
  let component: FeatureslayoutComponent;
  let fixture: ComponentFixture<FeatureslayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureslayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureslayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
