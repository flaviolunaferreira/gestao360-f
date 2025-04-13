/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BancoService } from './Banco.service';

describe('Service: Banco', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BancoService]
    });
  });

  it('should ...', inject([BancoService], (service: BancoService) => {
    expect(service).toBeTruthy();
  }));
});
