import { TestBed } from '@angular/core/testing';

import { CostosService } from './costos.service';

describe('CostosService', () => {
  let service: CostosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
