export interface NumeroCelular {
  celular: string;
  isWhatsapp: boolean;
}

export interface Contato {
  numerosCelular: NumeroCelular[];
  bairro: string;
}

export type StatusConsulta = 'MARCADO' | 'AGUARDANDO' | 'NAO_POSSUI_WHATSAPP' | 'REJEITADO';

export interface Consulta {
  nome: string;
  dataAtendimento: string;
  dataMarcacao?: string;
  status: StatusConsulta;
}

export interface PacienteRequest {
  nome: string;
  contato: Contato;
  consulta: Consulta;
}

export interface PacienteResponse {
  codigo: string;
  nome: string;
  contato: Contato;
  consulta: Consulta;
}

export interface PacienteCreatedResponse {
  mensagem: string;
  paciente: PacienteResponse;
  filaTamanho: number;
}

export interface PaginaResponse<T> {
  conteudo: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
}
