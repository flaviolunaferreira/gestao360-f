import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Banco, CreateBancoDTO, UpdateBancoDTO } from '../../interface/cadastro/Banco'
import { MessageService } from '../Message.service'
@Injectable({ providedIn: 'root' })
export class BancoService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:8080/api/bancos';

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = error.error?.message || error.message;
    }
    
    this.messageService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAll(): Observable<Banco[]> {
    return this.http.get<Banco[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: string): Observable<Banco> {
    return this.http.get<Banco>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(banco: CreateBancoDTO): Observable<Banco> {
    return this.http.post<Banco>(this.apiUrl, banco).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: string, banco: UpdateBancoDTO): Observable<Banco> {
    return this.http.put<Banco>(`${this.apiUrl}/${id}`, banco).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}