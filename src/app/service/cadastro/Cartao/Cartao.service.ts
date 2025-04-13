import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cartao, CreateCartaoDTO, UpdateCartaoDTO } from '../../../interface/cadastro/Cartao';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class CartaoService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:8080/api/cartoes';

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

  getAll(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: string): Observable<Cartao> {
    return this.http.get<Cartao>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(cartao: CreateCartaoDTO): Observable<Cartao> {
    return this.http.post<Cartao>(this.apiUrl, cartao).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: string, cartao: UpdateCartaoDTO): Observable<Cartao> {
    return this.http.put<Cartao>(`${this.apiUrl}/${id}`, cartao).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}