/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContaCorrenteService } from './Conta-Corrente.service';

describe('Service: ContaCorrente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContaCorrenteService]
    });
  });

  it('should ...', inject([ContaCorrenteService], (service: ContaCorrenteService) => {
    expect(service).toBeTruthy();
  }));
});
