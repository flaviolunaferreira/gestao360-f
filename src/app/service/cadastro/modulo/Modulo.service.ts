// src/app/features/modulos/services/modulo.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Modulo, CreateModuloDTO, UpdateModuloDTO } from '../../../interface/cadastro/Modulo';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${"http://localhost:8080"}/modulos`;

  /**
   * Obtém o token de autenticação
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token sendo enviado:', token); // Adicione este log
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  /**
   * Obtém todos os módulos
   */
  getAll(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtém um módulo por ID
   */
  getById(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Cria um novo módulo
   */
  create(modulo: CreateModuloDTO): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, modulo, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Atualiza um módulo existente
   */
  update(id: number, modulo: UpdateModuloDTO): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${id}`, modulo, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove um módulo
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca módulos por nome (para autocomplete)
   */
  searchByName(term: string): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params: { nome: term }
    }).pipe(
      catchError((error) => {
        console.error('Erro na busca:', error);
        return throwError(() => error);
      })
    );
  }
}
