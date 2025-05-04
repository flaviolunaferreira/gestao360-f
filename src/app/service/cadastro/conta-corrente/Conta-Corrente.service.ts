import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContaCorrenteRequestDTO, ContaCorrenteResponseDTO } from '../../../interface/cadastro/Conta-Corrente';

@Injectable({
  providedIn: 'root'
})
export class ContaCorrenteService {
  private apiUrl = `http://localhost:8080/api/contas-correntes`;

  constructor(private http: HttpClient) {}

  create(request: ContaCorrenteRequestDTO): Observable<ContaCorrenteResponseDTO> {
    return this.http.post<ContaCorrenteResponseDTO>(this.apiUrl, request);
  }

  getAll(): Observable<ContaCorrenteResponseDTO[]> {
    return this.http.get<ContaCorrenteResponseDTO[]>(this.apiUrl);
  }

  getByNumero(numero: string): Observable<ContaCorrenteResponseDTO> {
    return this.http.get<ContaCorrenteResponseDTO>(`${this.apiUrl}/${numero}`);
  }

  update(numero: string, request: ContaCorrenteRequestDTO): Observable<ContaCorrenteResponseDTO> {
    return this.http.put<ContaCorrenteResponseDTO>(`${this.apiUrl}/${numero}`, request);
  }

  delete(numero: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numero}`);
  }

  getBancos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/bancos`);
  }
}