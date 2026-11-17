# 🛒 MarketPro — Plataforma de E-commerce e Gestão de Supermercado

Aplicação web full-stack desenvolvida em **Angular** com API REST simulada via **JSON Server**, projetada para gerenciar o fluxo completo de compras de um supermercado digital — desde a vitrine de produtos e checkout do cliente até o controle administrativo de estoque, dashboard gerencial e histórico institucional.

---

## 📋 Índice
- [Visão Geral e Funcionalidades](#-visão-geral-e-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Estrutura de Pastas](#-arquitetura-e-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar Localmente](#-como-executar-localmente)
- [Deploy e Execução em Máquina Virtual Linux](#-deploy-e-execução-em-máquina-virtual-linux)
- [Credenciais de Acesso (Ambiente de Testes)](#-credenciais-de-acesso-ambiente-de-testes)
- [Autor](#-autor)

---

## 🚀 Visão Geral e Funcionalidades

O sistema divide-se em dois perfis de navegação protegidos por **Router Guards** e autenticação baseada em sessão:

### 👤 Portal do Comprador
* **Vitrine de Produtos:** Catálogo dinâmico com busca, visualização de preços, imagens e disponibilidade em tempo real.
* **Carrinho de Compras e Checkout:** Adição/remoção de itens, cálculo automático de subtotal e fluxo completo de pagamento fictício.
* **Sincronização de Estoque:** Ao finalizar um pedido, a quantidade adquirida é automaticamente descontada do estoque no banco de dados (`db.json`).
* **Histórico Institucional:** Tela dedicada apresentando a trajetória e os valores da empresa.

### 🛠️ Portal Administrativo
* **Dashboard Gerencial:** Painel visual com gráficos de desempenho, métricas de vendas, faturamento e monitoramento de estoque.
* **Gestão de Produtos (CRUD):** Cadastro, edição, atualização de estoque e exclusão de mercadorias.
* **Controle de Pedidos:** Acompanhamento das transações realizadas pelos clientes.

---

## 💻 Tecnologias Utilizadas

* **Frontend:** Angular (TypeScript, RxJS, HTML5, CSS3)
* **Backend / API Mock:** JSON Server (`db.json` expondo endpoints REST `/usuarios`, `/produtos`, `/pedidos`)
* **Gerenciamento de Ambiente:** Node.js v18 (via NVM) & NPM
* **Infraestrutura e Deploy:** Rocky Linux 10, SSH (Ed25519), VS Code Remote-SSH & Port Forwarding
* **Versionamento:** Git & GitHub

---

## 📂 Arquitetura e Estrutura de Pastas

```text
MarketPro/
├── db.json                        # Base de dados JSON Server (usuários, produtos e pedidos)
├── package.json                   # Dependências e scripts de execução (start e backend)
├── angular.json                   # Configurações de build e serve do Angular
└── src/
    ├── environments/              # Variáveis de ambiente (API URL para dev e produção)
    │   ├── environment.ts
    │   └── environment.prod.ts
    ├── assets/                    # Imagens locais dos produtos e identidade visual
    └── app/
        ├── core/                  # Serviços HTTP, autenticação e Router Guards
        ├── modules/
        │   ├── admin/             # Dashboard, gráficos e gerenciamento de estoque
        │   ├── buyer/             # Vitrine, carrinho, checkout e histórico da empresa
        │   └── auth/              # Telas de login e cadastro
        └── shared/                # Componentes reutilizáveis (navbar, footer, modelos)
