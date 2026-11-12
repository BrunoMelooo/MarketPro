import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ProdutoService } from '../../services/produto.service';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto.model';
import { Pedido } from '../../models/pedido.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  produtos: Produto[] = [];
  pedidos: Pedido[] = [];
  novoProduto: Produto = { nome: '', preco: 0, estoque: 0, categoria: '' };
  limiteEstoqueMinimo: number = environment.estoqueMinimoAlerta;

  // Controle de edição de estoque por item
  estoqueEditado: { [id: number]: number } = {};
  salvandoEstoqueId: number | null = null;
  mensagemFeedback: string | null = null;

  // Métricas
  faturamentoTotal: number = 0;
  totalVendasCount: number = 0;
  totalItensEstoque: number = 0;
  produtosBaixoEstoque: number = 0;

  // Gráfico de Barras - Estoque por Categoria
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Unidades em Estoque por Categoria',
        backgroundColor: '#0284c7',
        borderRadius: 6
      }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  // Gráfico de Rosca - Distribuição por Forma de Pagamento
  public doughnutChartLabels: string[] = ['Cartão de Crédito', 'Pix', 'Boleto'];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#0284c7', '#16a34a', '#f59e0b']
      }
    ]
  };
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    public servicoAutenticacao: AutenticacaoService,
    private servicoProduto: ProdutoService,
    private servicoPedido: PedidoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.servicoProduto.obterProdutos().subscribe(dados => {
      this.produtos = dados;
      this.estoqueEditado = {};
      dados.forEach(p => {
        if (p.id !== undefined) {
          this.estoqueEditado[p.id] = p.estoque;
        }
      });
      this.calcularMetricasEstoque();
      this.atualizarGraficoEstoque();
    });

    this.servicoPedido.obterPedidos().subscribe(dados => {
      this.pedidos = dados;
      this.calcularMetricasVendas();
      this.atualizarGraficoPagamentos();
    });
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
        this.carregarDados();
      },
      error: () => {
        this.salvandoEstoqueId = null;
        this.exibirFeedback(`Erro ao atualizar estoque de "${produto.nome}".`);
      }
    });
  }

  private exibirFeedback(msg: string): void {
    this.mensagemFeedback = msg;
    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 3500);
  }

  calcularMetricasEstoque(): void {
    this.totalItensEstoque = this.produtos.reduce((soma, item) => soma + item.estoque, 0);
    this.produtosBaixoEstoque = this.produtos.filter(item => item.estoque <= this.limiteEstoqueMinimo).length;
  }

  calcularMetricasVendas(): void {
    this.totalVendasCount = this.pedidos.length;
    this.faturamentoTotal = this.pedidos.reduce((soma, pedido) => soma + pedido.valorTotal, 0);
  }

  atualizarGraficoEstoque(): void {
    const categoriasMap: { [cat: string]: number } = {};
    this.produtos.forEach(p => {
      const cat = p.categoria || 'Outros';
      categoriasMap[cat] = (categoriasMap[cat] || 0) + p.estoque;
    });

    this.barChartData = {
      labels: Object.keys(categoriasMap),
      datasets: [
        {
          data: Object.values(categoriasMap),
          label: 'Estoque Total por Categoria',
          backgroundColor: '#0284c7',
          borderRadius: 6
        }
      ]
    };
  }

  atualizarGraficoPagamentos(): void {
    let credito = 0;
    let pix = 0;
    let boleto = 0;

    this.pedidos.forEach(p => {
      if (p.metodoPagamento === 'Cartão de Crédito') credito += p.valorTotal;
      else if (p.metodoPagamento === 'Pix') pix += p.valorTotal;
      else if (p.metodoPagamento === 'Boleto Bancário') boleto += p.valorTotal;
    });

    this.doughnutChartData = {
      labels: ['Cartão de Crédito', 'Pix', 'Boleto'],
      datasets: [
        {
          data: [credito, pix, boleto],
          backgroundColor: ['#0284c7', '#16a34a', '#f59e0b']
        }
      ]
    };
  }

  adicionarProduto(): void {
    if (!this.novoProduto.nome || this.novoProduto.preco <= 0) return;

    this.servicoProduto.adicionarProduto(this.novoProduto).subscribe(() => {
      this.exibirFeedback(`Produto "${this.novoProduto.nome}" cadastrado!`);
      this.carregarDados();
      this.novoProduto = { nome: '', preco: 0, estoque: 0, categoria: '' };
    });
  }

  excluirProduto(id?: number): void {
    if (!id) return;
    this.servicoProduto.excluirProduto(id).subscribe(() => {
      this.exibirFeedback('Produto removido do inventário.');
      this.carregarDados();
    });
  }

  voltarParaLoja(): void {
    this.router.navigate(['/loja']);
  }

  sair(): void {
    this.servicoAutenticacao.sair();
    this.router.navigate(['/loja']);
  }
}
