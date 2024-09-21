import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMapComponent } from './position-map.component';

describe('PositionMapComponent', () => {
  let component: PositionMapComponent;
  let fixture: ComponentFixture<PositionMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PositionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
