/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmpresaServiceService } from './EmpresaService.service';

describe('Service: EmpresaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpresaServiceService]
    });
  });

  it('should ...', inject([EmpresaServiceService], (service: EmpresaServiceService) => {
    expect(service).toBeTruthy();
  }));
});
