// src/app/features/modulos/services/modulo.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Modulo, CreateModuloDTO, UpdateModuloDTO } from '../../../interface/cadastro/Modulo';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = `${"http://localhost:8080"}/modulos`;

  /**
   * Obtém todos os módulos
   */
  getAll(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.messageService.error('Erro ao carregar módulos');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtém um módulo por ID
   */
  getById(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao carregar módulo ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cria um novo módulo
   */
  create(modulo: CreateModuloDTO): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, modulo).pipe(
      catchError((error) => {
        this.messageService.error('Erro ao criar módulo');
        return throwError(() => error);
      })
    );
  }

  /**
   * Atualiza um módulo existente
   */
  update(id: number, modulo: UpdateModuloDTO): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${id}`, modulo).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao atualizar módulo ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove um módulo
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao remover módulo ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca módulos por nome (para autocomplete)
   */
  searchByName(term: string): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/search`, {
      params: { nome: term }
    }).pipe(
      catchError((error) => {
        console.error('Erro na busca:', error);
        return throwError(() => error);
      })
    );
  }
}
