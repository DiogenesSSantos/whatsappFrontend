import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteRequest, PacienteResponse, PacienteCreatedResponse, PaginaResponse } from '../models/paciente.model';

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

  buscarComFiltros(filtros: {
    nome?: string;
    bairro?: string;
    consultaNome?: string;
    status?: string;
    dataMarcacaoInicio?: string;
    dataAtendimentoInicio?: string;
    page?: number;
    size?: number;
  }): Observable<PaginaResponse<PacienteResponse>> {
    let params = new HttpParams();
    if (filtros.nome) params = params.set('nome', filtros.nome);
    if (filtros.bairro) params = params.set('bairro', filtros.bairro);
    if (filtros.consultaNome) params = params.set('consultaNome', filtros.consultaNome);
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.dataMarcacaoInicio) params = params.set('dataMarcacaoInicio', filtros.dataMarcacaoInicio);
    if (filtros.dataAtendimentoInicio) params = params.set('dataAtendimentoInicio', filtros.dataAtendimentoInicio);
    params = params.set('page', (filtros.page ?? 0).toString());
    params = params.set('size', (filtros.size ?? 10).toString());
    return this.http.get<PaginaResponse<PacienteResponse>>(`${this.apiUrl}/buscar`, { params });
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
