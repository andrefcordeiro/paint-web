import { TestBed } from '@angular/core/testing';

import { CaretakerService } from './caretaker.service';

describe('CaretakerService', () => {
  let service: CaretakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaretakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
