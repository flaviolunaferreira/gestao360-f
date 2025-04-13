/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CartaoService } from './Cartao.service';

describe('Service: Cartao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartaoService]
    });
  });

  it('should ...', inject([CartaoService], (service: CartaoService) => {
    expect(service).toBeTruthy();
  }));
});
