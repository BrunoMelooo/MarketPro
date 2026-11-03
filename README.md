# 🛒 MarketPro — Sistema de Gestão para Supermercados

O **MarketPro** é uma aplicação web front-end desenvolvida em **Angular v16+**, criada para modernizar e simplificar a gestão operacional de supermercados e mercadinhos de bairro. A solução centraliza o controle de estoque, alertas de validade, cadastros comerciais e relatórios em uma interface moderna e intuitiva.

---

## 📌 Sobre o Projeto

Este projeto foi desenvolvido para a disciplina de **Desenvolvimento Web Front-End** do curso de **Ciência da Computação** da **Universidade FUMEC**, sob orientação do professor **Dângelo Silva Miranda**.

A aplicação evoluiu de um protótipo estático para um sistema web totalmente funcional com manipulação reativa de dados, roteamento dinâmico e regras de negócio encapsuladas.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

- **Framework Front-End:** [Angular v16](https://angular.io/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado Reativo:** [RxJS](https://rxjs.dev/) (`BehaviorSubject`, `Observable`)
- **Estilização e Layout:** HTML5, CSS3 Responsivo e componentes reutilizáveis
- **Banco de Dados (Simulação/Mock):** `db.json` / Array estático encapsulado via Angular Services
- **Execução & Bundler:** Angular CLI e Node.js

---

## 🖥️ Telas e Funcionalidades Implementadas

1. **Autenticação (Login):**
   - Formulário de login com validação de credenciais e redirecionamento de acesso.
2. **Dashboard Operacional:**
   - Painel dinâmico exibindo cartões KPI com quantidade total de produtos, valor investido em estoque e alertas automáticos.
3. **Catálogo e Listagem de Produtos:**
   - Tabela interativa com busca por nome/código, filtro por categoria e sinalização visual para produtos com estoque crítico.
4. **Ficha de Detalhes do Produto:**
   - Exibição completa das informações do produto (lote, validade, fornecedor, margem de lucro) utilizando parâmetros de rota (`ActivatedRoute`).
5. **Formulário de Cadastro e Edição:**
   - Formulário unificado com data-binding bidirecional (`[(ngModel)]`) para inclusão de novos produtos e alteração de dados existentes.
6. **Relatórios e Validade:**
   - Painel analítico focado no controle de produtos próximos da data de vencimento.

---

## 💡 Principais Conceitos Angular Utilizados

- **Components:** Divisão modular da interface (Navbar, Login, Listagem, Formulário, Dashboard e Relatórios).
- **Services & DI (Injeção de Dependência):** Classe `ProdutoService` isolando todas as regras de CRUD e estado da aplicação.
- **Data-Binding:** 
  - Interpolação `{{ }}`
  - Property Binding `[ ]`
  - Event Binding `( )`
  - Two-Way Data Binding `[(ngModel)]`
- **Diretivas Angular:**
  - Estruturais (`*ngFor`, `*ngIf`)
  - Atributos (`[ngClass]`, `[ngStyle]`)
- **Roteamento:** Módulo `AppRoutingModule` com suporte a redirecionamentos, parâmetros dinâmicos (`:id`) e rota coringa (`**`).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Possuir o **Node.js** e o **Angular CLI** instalados em sua máquina.

### Passo a passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/BrunoMelooo/MarketPro.git](https://github.com/BrunoMelooo/MarketPro.git)