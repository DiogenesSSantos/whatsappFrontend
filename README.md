# WhatsApp Frontend — Painel de Gestão de Pacientes

Interface web para cadastro, listagem e gestão de pacientes, integrada à [WhatsApp API](https://github.com/DiogenesSSantos/whatsappApi) — backend Java que processa notificações via WhatsApp utilizando Evolution Go API e geração de mensagens inteligentes com Ollama (LLM local).

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Integração com o Backend](#integração-com-o-backend)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração](#configuração)

---

## Visão Geral

Este frontend é um painel administrativo desenvolvido em **Angular 22** que permite cadastrar e listar pacientes que recebem notificações de consulta via WhatsApp. Ele se comunica com o backend Java (WhatsApp API) através de requisições HTTP REST.

**Fluxo de uso:**

```
Usuário cadastra paciente no frontend
        ↓
Frontend envia POST para /api/pacientes (backend Java)
        ↓
Backend salva no MySQL, gera mensagem via Ollama e envia WhatsApp (Evolution Go)
        ↓
Frontend lista todos os pacientes com status da notificação
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Angular 22 |
| Linguagem | TypeScript 6.0 |
| Build | Angular CLI 22 + Vite |
| HTTP | Angular HttpClient |
| Formulários | Angular Forms (Template-driven) |
| Router | Angular Router |
| Estilos | CSS puro |

---

## Funcionalidades

### Listagem de Pacientes (`/pacientes`)
- Tabela responsiva com todos os pacientes cadastrados
- Indicador visual de status (Marcado, Aguardando, Rejeitado, Sem WhatsApp)
- Badge de WhatsApp nos números de celular
- Loading spinner durante carregamento
- Mensagem de erro amigável quando a API não responde

### Cadastro de Paciente (`/pacientes/novo`)
- Formulário completo com validação
- Suporte a múltiplos números de celular (com flag WhatsApp)
- Seleção de tipo de consulta e status
- Campos de data/hora de atendimento e marcação
- Feedback visual de sucesso/erro após cadastro
- Redirecionamento automático para a listagem após 2 segundos

---

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│                  Angular App                      │
│                                                   │
│  ┌───────────────┐  ┌──────────────────────────┐  │
│  │  App Component │  │    Router                 │  │
│  │  (navbar +     │  │  / → /pacientes           │  │
│  │   router-outlet│  │  /pacientes/novo          │  │
│  │  )             │  └──────────────────────────┘  │
│  └───────┬───────┘                                │
│          │                                        │
│  ┌───────┴────────────────────────────────────┐   │
│  │           Components                        │   │
│  │  ┌────────────────┐  ┌──────────────────┐  │   │
│  │  │ PacienteList    │  │ PacienteForm     │  │   │
│  │  │ Component       │  │ Component        │  │   │
│  │  └───────┬────────┘  └──────┬───────────┘  │   │
│  └──────────┼──────────────────┼──────────────┘   │
│             │                  │                   │
│  ┌──────────┴──────────────────┴──────────────┐   │
│  │           Services                          │   │
│  │  ┌──────────────────────────────────────┐  │   │
│  │  │        PacienteService                │  │   │
│  │  │  GET  /api/pacientes                  │  │   │
│  │  │  POST /api/pacientes                  │  │   │
│  │  └──────────────────────────────────────┘  │   │
│  └───────────────────┬───────────────────────┘   │
└──────────────────────┼───────────────────────────┘
                       │ HTTP (proxy /api → :8082)
                       ↓
              ┌─────────────────┐
              │  WhatsApp API    │
              │  (Spring Boot)   │
              │  localhost:8082  │
              └─────────────────┘
```

---

## Estrutura do Projeto

```
src/
├── main.ts                          # Bootstrap da aplicação Angular
├── index.html                       # Template HTML principal
├── styles.css                       # Estilos globais
│
├── app/
│   ├── app.ts                       # Componente raiz (navbar + router-outlet)
│   ├── app.config.ts                # Providers: Router, HttpClient, Zone.js
│   ├── app.routes.ts                # Definição de rotas
│   │
│   ├── components/
│   │   ├── paciente-list/
│   │   │   ├── paciente-list.component.ts      # Lógica de listagem
│   │   │   ├── paciente-list.component.html    # Template da tabela
│   │   │   └── paciente-list.component.css     # Estilos da listagem
│   │   │
│   │   └── paciente-form/
│   │       ├── paciente-form.component.ts       # Lógica de cadastro
│   │       ├── paciente-form.component.html     # Template do formulário
│   │       └── paciente-form.component.css      # Estilos do formulário
│   │
│   ├── services/
│   │   └── paciente.service.ts      # Serviço HTTP (GET/POST /api/pacientes)
│   │
│   └── models/
│       └── paciente.model.ts        # Interfaces TypeScript (request/response)
│
├── proxy.conf.json                  # Proxy reverso para API backend
├── angular.json                     # Configuração do Angular CLI
├── tsconfig.json                    # Configuração TypeScript
└── package.json                     # Dependências do projeto
```

---

## Integração com o Backend

Este frontend se comunica com o [WhatsApp API](https://github.com/DiogenesSSantos/whatsappApi), um backend Java (Spring Boot) que:

- **Cadastra pacientes** no MySQL
- **Envia notificações** via WhatsApp (Evolution Go API)
- **Gera mensagens personalizadas** com Ollama (LLM local)

### Endpoints utilizados

| Método | Endpoint | Descrição | Usado em |
|---|---|---|---|
| `GET` | `/api/pacientes` | Lista todos os pacientes | Listagem |
| `POST` | `/api/pacientes` | Cadastra um paciente e enfileira notificação | Formulário |

### Proxy de desenvolvimento

O `proxy.conf.json` redireciona chamadas `/api/*` para o backend rodando em `localhost:8082`:

```json
{
  "/api": {
    "target": "http://localhost:8082",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Modelo de dados compartilhado

```
PacienteRequest / PacienteResponse
├── nome: string
├── contato
│   ├── bairro: string
│   └── numerosCelular[]
│       ├── celular: string (formato: 55DDD9XXXXXXX)
│       └── isWhatsapp: boolean
└── consulta
    ├── nome: string
    ├── dataAtendimento: string (ISO 8601)
    ├── dataMarcacao: string (ISO 8601)
    └── status: MARCADO | AGUARDANDO | NAO_POSSUI_WHATSAPP | REJEITADO
```

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Backend [WhatsApp API](https://github.com/DiogenesSSantos/whatsappApi) rodando na porta 8082

---

## Instalação e Execução

### Instalar dependências

```bash
npm install
```

### Iniciar o servidor de desenvolvimento

```bash
ng serve
```

A aplicação estará disponível em **http://localhost:4200**

> **Importante:** O backend Java deve estar rodando na porta 8082 para que as requisições API funcionem corretamente via proxy.

### Build para produção

```bash
ng build --configuration production
```

Os arquivos compilados serão gerados em `dist/whatsappFrontend/browser/`.

---

## Configuração

### Porta do backend

Se o backend rodar em porta diferente de 8082, altere o `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:SUA_PORTA",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## Licença

MIT

---

**Autor:** Diógenes Santos
- GitHub: [DiogenesSSantos](https://github.com/DiogenesSSantos)
