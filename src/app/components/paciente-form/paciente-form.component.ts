import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteRequest } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css'],
})
export class PacienteFormComponent {
  paciente: PacienteRequest = {
    nome: '',
    contato: {
      numerosCelular: [{ celular: '', isWhatsapp: true }],
      bairro: '',
    },
    consulta: {
      nome: '',
      dataAtendimento: '',
      status: 'MARCADO',
    },
  };

  mensagem = '';
  erro = '';
  carregando = false;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
  ) {}

  adicionarNumero(): void {
    this.paciente.contato.numerosCelular.push({ celular: '', isWhatsapp: true });
  }

  removerNumero(index: number): void {
    if (this.paciente.contato.numerosCelular.length > 1) {
      this.paciente.contato.numerosCelular.splice(index, 1);
    }
  }

  formatarData(data: string): string {
    return data ? data + ':00' : '';
  }

  onSubmit(): void {
    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    const dadosEnvio: PacienteRequest = {
      ...this.paciente,
      consulta: {
        ...this.paciente.consulta,
        dataAtendimento: this.formatarData(this.paciente.consulta.dataAtendimento),
      },
    };

    this.pacienteService.criar(dadosEnvio).subscribe({
      next: (res) => {
        this.mensagem = `${res.mensagem} (Fila: ${res.filaTamanho})`;
        this.carregando = false;
        setTimeout(() => this.router.navigate(['/pacientes']), 2000);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao cadastrar paciente';
        this.carregando = false;
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/pacientes']);
  }
}
