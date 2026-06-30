import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteRequest, PacienteResponse } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paciente-edit.component.html',
  styleUrls: ['./paciente-edit.component.css'],
})
export class PacienteEditComponent implements OnInit {
  codigo = '';
  paciente: PacienteRequest = {
    nome: '',
    contato: {
      numerosCelular: [{ celular: '', isWhatsapp: true }],
      bairro: '',
    },
    consulta: {
      nome: '',
      dataAtendimento: '',
      dataMarcacao: '',
      status: 'MARCADO',
    },
  };

  mensagem = '';
  erro = '';
  carregando = false;
  carregandoDados = true;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.codigo = this.route.snapshot.paramMap.get('codigo') || '';
    const state = history.state as { paciente?: PacienteResponse };

    if (state?.paciente) {
      this.preencherDados(state.paciente);
      this.carregandoDados = false;
      this.cdr.detectChanges();
    } else if (this.codigo) {
      this.carregarPaciente();
    } else {
      this.erro = 'Código do paciente não encontrado.';
      this.carregandoDados = false;
      this.cdr.detectChanges();
    }
  }

  preencherDados(data: PacienteResponse): void {
    this.paciente = {
      nome: data.nome,
      contato: {
        numerosCelular: data.contato.numerosCelular.map((n) => ({
          celular: n.celular,
          isWhatsapp: n.isWhatsapp,
        })),
        bairro: data.contato.bairro,
      },
      consulta: {
        nome: data.consulta.nome,
        dataAtendimento: this.formatarParaInput(data.consulta.dataAtendimento),
        dataMarcacao: this.formatarParaInput(data.consulta.dataMarcacao),
        status: data.consulta.status,
      },
    };
  }

  carregarPaciente(): void {
    this.pacienteService.buscarPorCodigo(this.codigo).subscribe({
      next: (data) => {
        this.preencherDados(data);
        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar dados do paciente.';
        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
    });
  }

  formatarParaInput(data: string | undefined): string {
    if (!data) return '';
    return data.substring(0, 16);
  }

  adicionarNumero(): void {
    this.paciente.contato.numerosCelular.push({ celular: '', isWhatsapp: true });
  }

  removerNumero(index: number): void {
    if (this.paciente.contato.numerosCelular.length > 1) {
      this.paciente.contato.numerosCelular.splice(index, 1);
    }
  }

  formatarData(data: string | undefined): string {
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
        dataMarcacao: this.formatarData(this.paciente.consulta.dataMarcacao),
      },
    };

    this.pacienteService.editar(this.codigo, dadosEnvio).subscribe({
      next: () => {
        this.mensagem = 'Paciente atualizado com sucesso!';
        this.carregando = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/pacientes']), 1500);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao atualizar paciente';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/pacientes']);
  }
}
