import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Produto, CreateProdutoDTO, UpdateProdutoDTO } from '../../../interface/cadastro/Produto';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:8080/api/produtos';

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

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(produto: CreateProdutoDTO): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: string, produto: UpdateProdutoDTO): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}