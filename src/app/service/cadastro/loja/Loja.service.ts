import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Loja, CreateLojaDTO, UpdateLojaDTO } from '../../../interface/cadastro/Loja';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class LojaService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:8080/api/lojas';

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message;
    }
    this.messageService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAll(): Observable<Loja[]> {
    return this.http.get<Loja[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: string): Observable<Loja> {
    return this.http.get<Loja>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(loja: CreateLojaDTO): Observable<Loja> {
    return this.http.post<Loja>(this.apiUrl, loja).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: string, loja: UpdateLojaDTO): Observable<Loja> {
    return this.http.put<Loja>(`${this.apiUrl}/${id}`, loja).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}