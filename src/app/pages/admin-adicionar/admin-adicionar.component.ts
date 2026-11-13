import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-admin-adicionar',
  templateUrl: './admin-adicionar.component.html',
  styleUrls: ['./admin-adicionar.component.css']
})
export class AdminAdicionarComponent {
  novoProduto: Produto = {
    nome: '',
    preco: 0,
    estoque: 0,
    categoria: '',
    imagemUrl: ''
  };

  mensagemFeedback: string | null = null;
  salvando: boolean = false;

  constructor(
    private servicoProduto: ProdutoService,
    public servicoAutenticacao: AutenticacaoService,
    public router: Router
  ) {}

  adicionarProduto(): void {
    if (!this.novoProduto.nome.trim() || this.novoProduto.preco <= 0) {
      this.exibirFeedback('Preencha o nome e um preço maior que zero.');
      return;
    }

    this.salvando = true;
    const payload: Produto = {
      nome: this.novoProduto.nome.trim(),
      preco: Number(this.novoProduto.preco),
      estoque: Math.max(0, Math.floor(Number(this.novoProduto.estoque) || 0)),
      categoria: this.novoProduto.categoria?.trim() || 'Geral',
      imagemUrl: this.novoProduto.imagemUrl?.trim() || undefined
    };

    this.servicoProduto.adicionarProduto(payload).subscribe({
      next: () => {
        this.salvando = false;
        this.exibirFeedback(`Produto "${payload.nome}" cadastrado com sucesso!`);
        this.novoProduto = { nome: '', preco: 0, estoque: 0, categoria: '', imagemUrl: '' };
      },
      error: () => {
        this.salvando = false;
        this.exibirFeedback('Erro ao cadastrar o produto. Verifique se o JSON Server está ativo.');
      }
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

  irParaEstoque(): void {
    this.router.navigate(['/gestao-interna/estoque']);
  }
}
