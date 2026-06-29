import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteResponse } from '../../models/paciente.model';
import { ToastComponent } from '../toast/toast.component';

interface Toast {
  id: number;
  mensagem: string;
  tipo: 'error' | 'success' | 'warning' | 'info' | 'server';
}

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [FormsModule, ToastComponent],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css'],
})
export class PacienteListComponent implements OnInit {
  pacientes: PacienteResponse[] = [];
  carregando = false;

  toasts: Toast[] = [];
  private toastId = 0;

  filtros = {
    nome: '',
    bairro: '',
    consultaNome: '',
    status: '',
    dataMarcacaoInicio: '',
    dataAtendimentoInicio: '',
  };

  paginaAtual = 0;
  tamanhoPagina = 10;
  totalItens = 0;
  totalPaginas = 0;

  modalExclusaoAberto = false;
  modalStatusAberto = false;
  pacienteSelecionado: PacienteResponse | null = null;
  novoStatus = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  adicionarToast(
    mensagem: string,
    tipo: 'error' | 'success' | 'warning' | 'info' | 'server' = 'error',
  ): void {
    const id = ++this.toastId;
    this.toasts.push({ id, mensagem, tipo });
    this.cdr.detectChanges();
  }

  fecharToast(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.cdr.detectChanges();
  }

  carregarPacientes(): void {
    this.carregando = true;
    this.cdr.detectChanges();

    this.pacienteService
      .buscarComFiltros({
        nome: this.filtros.nome || undefined,
        bairro: this.filtros.bairro || undefined,
        consultaNome: this.filtros.consultaNome || undefined,
        status: this.filtros.status || undefined,
        dataMarcacaoInicio: this.filtros.dataMarcacaoInicio || undefined,
        dataAtendimentoInicio: this.filtros.dataAtendimentoInicio || undefined,
        page: this.paginaAtual,
        size: this.tamanhoPagina,
      })
      .subscribe({
        next: (data) => {
          this.pacientes = data.conteudo;
          this.totalItens = data.totalItens;
          this.totalPaginas = data.totalPaginas;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.carregando = false;
          this.adicionarToast('Erro ao carregar. Verifique se a API esta rodando.', 'server');
        },
      });
  }

  aplicarFiltros(): void {
    if (this.filtros.dataMarcacaoInicio && this.filtros.dataAtendimentoInicio) {
      if (this.filtros.dataMarcacaoInicio > this.filtros.dataAtendimentoInicio) {
        this.adicionarToast(
          'Data de marcacao nao pode ser maior que data de atendimento.',
          'warning',
        );
        return;
      }
    }

    this.paginaAtual = 0;
    this.carregarPacientes();
  }

  limparFiltros(): void {
    this.filtros = {
      nome: '',
      bairro: '',
      consultaNome: '',
      status: '',
      dataMarcacaoInicio: '',
      dataAtendimentoInicio: '',
    };
    this.paginaAtual = 0;
    this.carregarPacientes();
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.carregarPacientes();
  }

  get paginas(): number[] {
    const paginas: number[] = [];
    for (let i = 0; i < this.totalPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  novoPaciente(): void {
    this.router.navigate(['/pacientes/novo']);
  }

  editar(paciente: PacienteResponse): void {
    this.router.navigate(['/pacientes/editar', paciente.codigo], { state: { paciente } });
  }

  confirmarExclusao(paciente: PacienteResponse): void {
    this.pacienteSelecionado = paciente;
    this.modalExclusaoAberto = true;
    this.cdr.detectChanges();
  }

  fecharModalExclusao(): void {
    this.modalExclusaoAberto = false;
    this.pacienteSelecionado = null;
    this.cdr.detectChanges();
  }

  excluir(): void {
    if (!this.pacienteSelecionado) return;
    const codigo = this.pacienteSelecionado.codigo;
    this.pacienteService.excluir(codigo).subscribe({
      next: () => {
        this.fecharModalExclusao();
        this.adicionarToast('Paciente excluido com sucesso!', 'success');
        this.carregarPacientes();
      },
      error: () => {
        this.fecharModalExclusao();
        this.adicionarToast('Erro ao excluir paciente.', 'server');
      },
    });
  }

  abrirModalStatus(paciente: PacienteResponse): void {
    this.pacienteSelecionado = paciente;
    this.novoStatus = paciente.consulta.status;
    this.modalStatusAberto = true;
    this.cdr.detectChanges();
  }

  fecharModalStatus(): void {
    this.modalStatusAberto = false;
    this.pacienteSelecionado = null;
    this.novoStatus = '';
    this.cdr.detectChanges();
  }

  atualizarStatus(): void {
    if (!this.pacienteSelecionado || !this.novoStatus) return;
    this.pacienteService
      .atualizarStatus(this.pacienteSelecionado.codigo, this.novoStatus)
      .subscribe({
        next: () => {
          this.pacienteSelecionado!.consulta.status = this.novoStatus as any;
          this.fecharModalStatus();
          this.adicionarToast('Status atualizado com sucesso!', 'success');
        },
        error: () => {
          this.fecharModalStatus();
          this.adicionarToast('Erro ao atualizar status.', 'server');
        },
      });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      MARCADO: 'status-marcado',
      AGUARDANDO: 'status-aguardando',
      NAO_POSSUI_WHATSAPP: 'status-sem-whatsapp',
      REJEITADO: 'status-rejeitado',
    };
    return classes[status] || '';
  }

  formatStatus(status: string): string {
    const labels: Record<string, string> = {
      MARCADO: 'Marcado',
      AGUARDANDO: 'Aguardando',
      NAO_POSSUI_WHATSAPP: 'Não Possui WhatsApp',
      REJEITADO: 'Rejeitado',
    };
    return labels[status] || status;
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  }
}
