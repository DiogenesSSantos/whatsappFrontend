# WhatsApp Frontend — Painel de Gestão de Pacientes

Interface web para cadastro, listagem, edição e gestão de pacientes, integrada à [WhatsApp API](https://github.com/DiogenesSSantos/whatsappApi) — backend Java que processa notificações via WhatsApp utilizando Evolution Go API e geração de mensagens inteligentes com Ollama (LLM local).

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

Painel administrativo desenvolvido em **Angular 22** para gerenciar pacientes que recebem notificações de consulta via WhatsApp. Comunica-se com o backend Java (WhatsApp API) através de requisições HTTP REST.

**Fluxo de uso:**

```
Usuário cadastra/edita paciente no frontend
        ↓
Frontend envia requisição para /api/pacientes (backend Java)
        ↓
Backend salva no MySQL, gera mensagem via Ollama e envia WhatsApp (Evolution Go)
        ↓
Frontend lista pacientes com filtros, paginação e status da notificação
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

### Filtros e Paginação
- Filtros por **nome**, **bairro**, **consulta** (startsWith) e **status** (exato)
- Filtros por **data de marcação** e **data de atendimento** (desde)
- Validação: data de marcação não pode ser maior que data de atendimento
- Paginação completa com navegação (primeira, anterior, números, próxima, última)
- Botão "Limpar" para resetar todos os filtros

### Cadastro de Paciente (`/pacientes/novo`)
- Formulário completo com validação
- Suporte a múltiplos números de celular (com flag WhatsApp)
- Seleção de tipo de consulta e status
- Campos de data/hora de atendimento e marcação
- Redirecionamento automático para a listagem após sucesso

### Edição de Paciente (`/pacientes/editar/:codigo`)
- Formulário pré-preenchido com dados do paciente
- Navega via router state (sem SELECT adicional ao clicar)
- Atualização de todos os campos incluindo múltiplos números de celular
- Validação preservada para datas futuras

### Alteração de Status
- Modal para alteração rápida de status na listagem
- Atualização otimizada via PATCH (sem recarregar lista)
- Status: Marcado, Aguardando, Não Possui WhatsApp, Rejeitado

### Exclusão de Paciente
- Modal de confirmação customizado
- Exclusão via DELETE direto por UUID
- Atualização automática da listagem

### Sistema de Notificações (Toast)
- Pop-ups no canto superior direito
- Cores diferenciadas: erro servidor (vermelho escuro), erro cliente (laranja), sucesso (verde)
- Auto-fechamento após 8 segundos com barra de progresso
- Botão de fechar manual

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Angular App                            │
│                                                          │
│  ┌───────────────┐  ┌───────────────────────────────┐   │
│  │  App Component │  │    Router                      │   │
│  │  (navbar +     │  │  / → /pacientes                │   │
│  │   router-outlet│  │  /pacientes/novo               │   │
│  │  )             │  │  /pacientes/editar/:codigo     │   │
│  └───────┬───────┘  └───────────────────────────────┘   │
│          │                                               │
│  ┌───────┴──────────────────────────────────────────┐   │
│  │              Components                           │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────┐│   │
│  │  │ PacienteList  │ │ PacienteForm │ │PacienteEdit││   │
│  │  │ (filtros,     │ │ (cadastro)   │ │(edicao)   ││   │
│  │  │  paginacao,   │ └──────────────┘ └───────────┘│   │
│  │  │  modais)      │ ┌──────────────┐              │   │
│  │  └──────────────┘ │ Toast        │              │   │
│  │                    │ (notificacoes)│              │   │
│  │                    └──────────────┘              │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │              PacienteService                       │   │
│  │  GET    /api/pacientes             (listar)       │   │
│  │  GET    /api/pacientes/buscar      (filtros)      │   │
│  │  GET    /api/pacientes/:codigo     (buscar)       │   │
│  │  POST   /api/pacientes             (cadastrar)    │   │
│  │  PUT    /api/pacientes/:codigo     (atualizar)    │   │
│  │  PATCH  /api/pacientes/:codigo/status (status)    │   │
│  │  DELETE /api/pacientes/:codigo     (excluir)      │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
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
│   │   ├── paciente-list/           # Listagem com filtros e paginação
│   │   │   ├── paciente-list.component.ts
│   │   │   ├── paciente-list.component.html
│   │   │   └── paciente-list.component.css
│   │   │
│   │   ├── paciente-form/           # Cadastro de novo paciente
│   │   │   ├── paciente-form.component.ts
│   │   │   ├── paciente-form.component.html
│   │   │   └── paciente-form.component.css
│   │   │
│   │   ├── paciente-edit/           # Edição de paciente existente
│   │   │   ├── paciente-edit.component.ts
│   │   │   ├── paciente-edit.component.html
│   │   │   └── paciente-edit.component.css
│   │   │
│   │   └── toast/                   # Sistema de notificações
│   │       └── toast.component.ts
│   │
│   ├── services/
│   │   └── paciente.service.ts      # Serviço HTTP (CRUD completo)
│   │
│   └── models/
│       └── paciente.model.ts        # Interfaces TypeScript
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
| `GET` | `/api/pacientes/buscar` | Busca com filtros e paginação | Listagem |
| `GET` | `/api/pacientes/:codigo` | Busca por UUID | Edição (fallback) |
| `POST` | `/api/pacientes` | Cadastra paciente + notificação | Cadastro |
| `PUT` | `/api/pacientes/:codigo` | Atualiza dados do paciente | Edição |
| `PATCH` | `/api/pacientes/:codigo/status` | Atualiza apenas o status | Modal status |
| `DELETE` | `/api/pacientes/:codigo` | Exclui paciente | Modal exclusão |

### Proxy de desenvolvimento

O `proxy.conf.json` redireciona chamadas `/api/*` para o backend em `localhost:8082`.

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Backend [WhatsApp API](https://github.com/DiogenesSSantos/whatsappApi) rodando na porta 8082

---

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve

# Build para produção
ng build --configuration production
```

A aplicação estará disponível em **http://localhost:4200**

---

## Configuração

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
