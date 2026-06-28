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

  buscarPorCodigo(codigo: string): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiUrl}/${codigo}`);
  }

  editar(codigo: string, paciente: PacienteRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${codigo}`, paciente);
  }

  excluir(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }

  atualizarStatus(codigo: string, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${codigo}/status`, { status });
  }
}
