import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ProdutoService } from '../../services/produto.service';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto.model';
import { Pedido } from '../../models/pedido.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  produtos: Produto[] = [];
  pedidos: Pedido[] = [];

  faturamentoTotal: number = 0;
  totalVendasCount: number = 0;
  totalItensEstoque: number = 0;
  produtosBaixoEstoque: number = 0;

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
      this.calcularMetricasEstoque();
      this.atualizarGraficoEstoque();
    });

    this.servicoPedido.obterPedidos().subscribe(dados => {
      this.pedidos = dados;
      this.calcularMetricasVendas();
      this.atualizarGraficoPagamentos();
    });
  }

  calcularMetricasEstoque(): void {
    this.totalItensEstoque = this.produtos.reduce((soma, item) => soma + item.estoque, 0);
    this.produtosBaixoEstoque = this.produtos.filter(item => item.estoque <= 10).length;
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

  irParaNovoProduto(): void {
    this.router.navigate(['/admin/produtos/novo']);
  }

  editarProduto(id?: number): void {
    if (id) {
      this.router.navigate([`/admin/produtos/editar/${id}`]);
    }
  }

  excluirProduto(id?: number): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este produto do inventário?')) {
      this.servicoProduto.excluirProduto(id).subscribe(() => {
        this.carregarDados();
      });
    }
  }

  sair(): void {
    this.servicoAutenticacao.sair();
    this.router.navigate(['/selecionar-perfil']);
  }
}
