/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PlanoService } from './Plano.service';

describe('Service: Plano', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanoService]
    });
  });

  it('should ...', inject([PlanoService], (service: PlanoService) => {
    expect(service).toBeTruthy();
  }));
});
