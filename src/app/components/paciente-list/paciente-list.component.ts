import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteResponse } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {
  pacientes: PacienteResponse[] = [];
  carregando = false;
  erro = '';

  modalExclusaoAberto = false;
  modalStatusAberto = false;
  pacienteSelecionado: PacienteResponse | null = null;
  novoStatus = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.carregando = true;
    this.cdr.detectChanges();
    this.pacienteService.listarTodos().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar. Verifique se a API está rodando.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  novoPaciente(): void {
    this.router.navigate(['/pacientes/novo']);
  }

  editar(codigo: string): void {
    this.router.navigate(['/pacientes/editar', codigo]);
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
        this.carregarPacientes();
      },
      error: () => {
        this.erro = 'Erro ao excluir paciente.';
        this.fecharModalExclusao();
        this.cdr.detectChanges();
      }
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
    this.pacienteService.atualizarStatus(this.pacienteSelecionado.codigo, this.novoStatus).subscribe({
      next: () => {
        this.fecharModalStatus();
        this.carregarPacientes();
      },
      error: () => {
        this.erro = 'Erro ao atualizar status.';
        this.fecharModalStatus();
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'MARCADO': 'status-marcado',
      'AGUARDANDO': 'status-aguardando',
      'NAO_POSSUI_WHATSAPP': 'status-sem-whatsapp',
      'REJEITADO': 'status-rejeitado'
    };
    return classes[status] || '';
  }

  formatStatus(status: string): string {
    const labels: Record<string, string> = {
      'MARCADO': 'Marcado',
      'AGUARDANDO': 'Aguardando',
      'NAO_POSSUI_WHATSAPP': 'Não Possui WhatsApp',
      'REJEITADO': 'Rejeitado'
    };
    return labels[status] || status;
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  }
}
