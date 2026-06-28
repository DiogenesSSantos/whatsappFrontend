export interface NumeroCelular {
  celular: string;
  isWhatsapp: boolean;
}

export interface Contato {
  numerosCelular: NumeroCelular[];
  bairro: string;
}

export interface StatusConsulta {
  MARCADO: 'MARCADO';
  AGUARDANDO: 'AGUARDANDO';
  NAO_POSSUI_WHATSAPP: 'NAO_POSSUI_WHATSAPP';
  REJEITADO: 'REJEITADO';
}

export interface Consulta {
  nome: string;
  dataAtendimento: string;
  dataMarcacao: string;
  status: 'MARCADO' | 'AGUARDANDO' | 'NAO_POSSUI_WHATSAPP' | 'REJEITADO';
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
