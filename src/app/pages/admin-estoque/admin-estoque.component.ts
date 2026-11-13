import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Produto } from '../../models/produto.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-estoque',
  templateUrl: './admin-estoque.component.html',
  styleUrls: ['./admin-estoque.component.css']
})
export class AdminEstoqueComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  termoBusca: string = '';
  limiteEstoqueMinimo: number = environment.estoqueMinimoAlerta;

  estoqueEditado: { [id: number]: number } = {};
  salvandoEstoqueId: number | null = null;
  mensagemFeedback: string | null = null;

  constructor(
    private servicoProduto: ProdutoService,
    public servicoAutenticacao: AutenticacaoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.servicoProduto.obterProdutos().subscribe(dados => {
      this.produtos = dados;
      this.estoqueEditado = {};
      dados.forEach(p => {
        if (p.id !== undefined) {
          this.estoqueEditado[p.id] = p.estoque;
        }
      });
      this.filtrarProdutos();
    });
  }

  filtrarProdutos(): void {
    const termo = this.termoBusca.trim().toLowerCase();
    if (!termo) {
      this.produtosFiltrados = [...this.produtos];
    } else {
      this.produtosFiltrados = this.produtos.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        (p.categoria || '').toLowerCase().includes(termo)
      );
    }
  }

  alterarQuantidadeLocal(produto: Produto, delta: number): void {
    if (produto.id === undefined) return;
    const atual = Number(this.estoqueEditado[produto.id] ?? produto.estoque);
    const novoValor = Math.max(0, atual + delta);
    this.estoqueEditado[produto.id] = novoValor;
  }

  houveAlteracaoEstoque(produto: Produto): boolean {
    if (produto.id === undefined) return false;
    const valorEditado = Number(this.estoqueEditado[produto.id]);
    return !isNaN(valorEditado) && valorEditado >= 0 && valorEditado !== produto.estoque;
  }

  salvarEstoque(produto: Produto): void {
    if (produto.id === undefined) return;
    const novaQuantidade = Math.max(0, Math.floor(Number(this.estoqueEditado[produto.id])));
    if (isNaN(novaQuantidade)) return;

    this.salvandoEstoqueId = produto.id;
    const produtoAtualizado: Produto = {
      ...produto,
      estoque: novaQuantidade
    };

    this.servicoProduto.atualizarProduto(produto.id, produtoAtualizado).subscribe({
      next: () => {
        this.salvandoEstoqueId = null;
        this.exibirFeedback(`Estoque de "${produto.nome}" atualizado para ${novaQuantidade} un.`);
        this.carregarProdutos();
      },
      error: () => {
        this.salvandoEstoqueId = null;
        this.exibirFeedback(`Erro ao atualizar estoque de "${produto.nome}".`);
      }
    });
  }

  excluirProduto(id?: number): void {
    if (!id) return;
    this.servicoProduto.excluirProduto(id).subscribe(() => {
      this.exibirFeedback('Produto removido do inventário.');
      this.carregarProdutos();
    });
  }

  private exibirFeedback(msg: string): void {
    this.mensagemFeedback = msg;
    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 3500);
  }

  voltarPainel(): void {
    this.router.navigate(['/gestao-interna']);
  }

  irParaAdicionar(): void {
    this.router.navigate(['/gestao-interna/adicionar']);
  }
}
