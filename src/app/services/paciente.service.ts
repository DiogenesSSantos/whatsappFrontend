import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteRequest, PacienteResponse, PacienteCreatedResponse } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = '/api/pacientes';

  constructor(private http: HttpClient) {}

  criar(paciente: PacienteRequest): Observable<PacienteCreatedResponse> {
    return this.http.post<PacienteCreatedResponse>(this.apiUrl, paciente);
  }

  listarTodos(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.apiUrl);
  }
}
