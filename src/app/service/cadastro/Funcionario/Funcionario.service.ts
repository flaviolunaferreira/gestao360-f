import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Funcionario, CreateFuncionarioDTO, UpdateFuncionarioDTO } from '../../../interface/cadastro/Funcionario';
import { MessageService } from '../../Message.service';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:8080/api/funcionarios';

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

  getAll(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getById(id: string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  create(funcionario: CreateFuncionarioDTO): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  update(id: string, funcionario: UpdateFuncionarioDTO): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, funcionario).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}