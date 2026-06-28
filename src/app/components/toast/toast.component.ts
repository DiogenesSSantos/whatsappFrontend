import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    <div class="toast" [class]="'toast-' + tipo" (click)="fechar()">
      <span class="toast-msg">{{ mensagem }}</span>
      <button class="toast-close">&times;</button>
      <div class="toast-progress"></div>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      min-width: 300px;
      max-width: 400px;
      padding: 14px 40px 14px 16px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 9999;
      cursor: pointer;
      overflow: hidden;
      animation: slideIn 0.3s ease;
    }

    .toast-error { background: #d32f2f; }
    .toast-success { background: #2e7d32; }
    .toast-warning { background: #f57c00; }
    .toast-info { background: #1976d2; }
    .toast-server { background: #b71c1c; }

    .toast-msg { display: block; }

    .toast-close {
      position: absolute;
      top: 8px;
      right: 10px;
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.8;
      line-height: 1;
    }

    .toast-close:hover { opacity: 1; }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255,255,255,0.5);
      animation: shrink 8s linear forwards;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent implements OnInit {
  @Input() mensagem = '';
  @Input() tipo: 'error' | 'success' | 'warning' | 'info' | 'server' = 'error';
  @Input() duracao = 8000;
  @Output() fecharEvento = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => this.fechar(), this.duracao);
  }

  fechar(): void {
    this.fecharEvento.emit();
  }
}
