import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteResponse } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {
  pacientes: PacienteResponse[] = [];
  carregando = false;
  erro = '';

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
