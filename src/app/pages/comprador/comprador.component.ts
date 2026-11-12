import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-comprador',
  templateUrl: './comprador.component.html',
  styleUrls: ['./comprador.component.css']
})
export class CompradorComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: string[] = ['Todas'];
  categoriaSelecionada: string = 'Todas';
  termoBusca: string = '';

  carrinho: { produto: Produto; quantidade: number }[] = [];
  mensagemNotificacao: string | null = null;
  pagamentoSucesso: boolean = false;
  metodoPagamento: string = 'Cartão de Crédito';
  nomeApp: string = environment.appName;

  constructor(
    private servicoProduto: ProdutoService,
    public servicoAutenticacao: AutenticacaoService,
    private servicoPedido: PedidoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.servicoProduto.obterProdutos().subscribe(dados => {
      this.produtos = dados;
      const catsUnicas = Array.from(new Set(dados.map(p => p.categoria || 'Geral')));
      this.categorias = ['Todas', ...catsUnicas];
      this.filtrarProdutos();
    });
  }

  filtrarProdutos(): void {
    this.produtosFiltrados = this.produtos.filter(prod => {
      const bateCategoria = this.categoriaSelecionada === 'Todas' || (prod.categoria || 'Geral') === this.categoriaSelecionada;
      const bateBusca = !this.termoBusca.trim() || prod.nome.toLowerCase().includes(this.termoBusca.toLowerCase());
      return bateCategoria && bateBusca;
    });
  }

  selecionarCategoria(cat: string): void {
    this.categoriaSelecionada = cat;
    this.filtrarProdutos();
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (produto.estoque <= 0) {
      this.exibirNotificacao(`Produto "${produto.nome}" sem estoque no momento.`);
      return;
    }

    const itemExistente = this.carrinho.find(item => item.produto.id === produto.id);
    if (itemExistente) {
      if (itemExistente.quantidade < produto.estoque) {
        itemExistente.quantidade += 1;
        this.exibirNotificacao(`Mais 1 un. de "${produto.nome}" adicionada!`);
      } else {
        this.exibirNotificacao(`Limite em estoque atingido para "${produto.nome}".`);
      }
    } else {
      this.carrinho.push({ produto, quantidade: 1 });
      this.exibirNotificacao(`Produto "${produto.nome}" adicionado ao carrinho!`);
    }
  }

  removerDoCarrinho(index: number): void {
    this.carrinho.splice(index, 1);
  }

  obterTotalItensCarrinho(): number {
    return this.carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  }

  obterValorTotal(): number {
    return this.carrinho.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
  }

  processarPagamento(): void {
    if (this.carrinho.length === 0) return;

    const usuario = this.servicoAutenticacao.valorUsuarioAtual;
    const valorTotal = this.obterValorTotal();

    const novoPedido = {
      usuarioId: usuario?.id || 2,
      nomeUsuario: usuario?.nome || 'Cliente Visitante',
      valorTotal: valorTotal,
      data: new Date().toISOString(),
      status: 'Concluído',
      metodoPagamento: this.metodoPagamento
    };

    this.servicoPedido.criarPedido(novoPedido).subscribe(() => {
      this.carrinho.forEach(item => {
        if (item.produto.id) {
          const estoqueAtualizado = item.produto.estoque - item.quantidade;
          this.servicoProduto.atualizarProduto(item.produto.id, {
            ...item.produto,
            estoque: estoqueAtualizado < 0 ? 0 : estoqueAtualizado
          }).subscribe(() => this.carregarProdutos());
        }
      });

      this.pagamentoSucesso = true;
      this.carrinho = [];
      setTimeout(() => {
        this.pagamentoSucesso = false;
      }, 5000);
    });
  }

  private exibirNotificacao(msg: string): void {
    this.mensagemNotificacao = msg;
    setTimeout(() => {
      this.mensagemNotificacao = null;
    }, 3000);
  }

  irParaLoginCliente(): void {
    this.router.navigate(['/login'], { queryParams: { perfil: 'buyer' } });
  }

  acessarAreaCorporativa(): void {
    if (this.servicoAutenticacao.estaAutenticado() && this.servicoAutenticacao.obterPerfil() === 'admin') {
      this.router.navigate(['/gestao-interna']);
    } else {
      this.router.navigate(['/login'], { queryParams: { perfil: 'admin' } });
    }
  }

  sair(): void {
    this.servicoAutenticacao.sair();
  }
}
