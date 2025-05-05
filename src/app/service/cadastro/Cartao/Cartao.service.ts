import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cartao, CreateCartaoDTO, UpdateCartaoDTO } from '../../../interface/cadastro/Cartao';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private apiUrl = 'http://localhost:8080/api/cartao';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.apiUrl);
  }

  getById(numeroCartao: string): Observable<Cartao> {
    return this.http.get<Cartao>(`${this.apiUrl}/${numeroCartao}`);
  }

  create(cartao: CreateCartaoDTO): Observable<Cartao> {
    return this.http.post<Cartao>(this.apiUrl, cartao);
  }

  update(numeroCartao: string, cartao: UpdateCartaoDTO): Observable<Cartao> {
    return this.http.put<Cartao>(`${this.apiUrl}/${numeroCartao}`, cartao);
  }

  delete(numeroCartao: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numeroCartao}`);
  }
}