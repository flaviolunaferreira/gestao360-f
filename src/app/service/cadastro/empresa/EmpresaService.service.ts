import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FieldConfig } from '../../../interface/Field-config.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaServiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://localhost:8080/empresas`;

  getConfig(): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(`${this.apiUrl}/options`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}