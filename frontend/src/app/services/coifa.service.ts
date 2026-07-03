import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coifa } from '../models/coifa.model';

@Injectable({ providedIn: 'root' })
export class CoifaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/coifa';

  getById(id: number): Observable<Coifa> {
    return this.http.get<Coifa>(`${this.baseUrl}/${id}`);
  }

  create(coifa: Coifa): Observable<void> {
    return this.http.post<void>(this.baseUrl, coifa);
  }

  update(coifa: Coifa): Observable<void> {
    return this.http.put<void>(this.baseUrl, coifa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
