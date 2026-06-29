import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav class="navbar">
      <div class="nav-brand">WhatsApp API - Pacientes</div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .navbar {
        background: #075e54;
        padding: 16px 24px;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      main {
        background: #f5f6fa;
        min-height: calc(100vh - 56px);
      }
    `,
  ],
})
export class App {}
