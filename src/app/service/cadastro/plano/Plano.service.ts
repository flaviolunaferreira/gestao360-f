// src/app/features/planos/services/plano.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Plano, CreatePlanoDTO, UpdatePlanoDTO } from '../../../interface/cadastro/Plano';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class PlanoService {
  getModulosDisponiveis(): any[] | PromiseLike<any[]> {
    throw new Error('Method not implemented.');
  }
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = `${"http:localhost:"}/planos`;

  /**
   * Obtém todos os planos
   */
  getAll(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.messageService.error('Erro ao carregar planos');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtém um plano por ID
   */
  getById(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao carregar plano ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cria um novo plano
   */
  create(plano: CreatePlanoDTO): Observable<Plano> {
    return this.http.post<Plano>(this.apiUrl, plano).pipe(
      catchError((error) => {
        this.messageService.error('Erro ao criar plano');
        return throwError(() => error);
      })
    );
  }

  /**
   * Atualiza um plano existente
   */
  update(id: number, plano: UpdatePlanoDTO): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, plano).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao atualizar plano ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove um plano
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao remover plano ${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Ativa/desativa um plano
   */
  toggleStatus(id: number): Observable<Plano> {
    return this.http.patch<Plano>(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      catchError((error) => {
        this.messageService.error(`Erro ao alterar status do plano ${id}`);
        return throwError(() => error);
      })
    );
  }
}
