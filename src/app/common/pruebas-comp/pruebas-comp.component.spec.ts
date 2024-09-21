import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasCompComponent } from './pruebas-comp.component';

describe('PruebasCompComponent', () => {
  let component: PruebasCompComponent;
  let fixture: ComponentFixture<PruebasCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebasCompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PruebasCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
