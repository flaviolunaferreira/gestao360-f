/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FornecedorService } from './Fornecedor.service';

describe('Service: Fornecedor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FornecedorService]
    });
  });

  it('should ...', inject([FornecedorService], (service: FornecedorService) => {
    expect(service).toBeTruthy();
  }));
});
