import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosFormComponent } from './costos-form.component';

describe('CostosFormComponent', () => {
  let component: CostosFormComponent;
  let fixture: ComponentFixture<CostosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
