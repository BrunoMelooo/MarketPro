import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  produtos: Produto[] = [];
  produtosCriticos: Produto[] = [];
  produtosVencimento: Produto[] = [];
  categoriasData: { nome: string; valor: number }[] = [];
  maxEstoqueCategoria = 1;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  ngAfterViewInit(): void {
    this.inicializarGrafico();
  }

  carregarDados(): void {
    this.produtos = this.produtoService.getProdutos();
    this.produtosCriticos = this.produtoService.getProdutosEstoqueBaixo();
    this.produtosVencimento = this.produtoService.getProdutosProximosVencimento();

    // Calcular o total de estoque por categoria dinamicamente
    const mapaCat: { [key: string]: number } = {};
    this.produtos.forEach(p => {
      mapaCat[p.categoria] = (mapaCat[p.categoria] || 0) + p.estoqueAtual;
    });

    this.categoriasData = Object.keys(mapaCat).map(nome => ({
      nome,
      valor: mapaCat[nome]
    }));

    const max = Math.max(...this.categoriasData.map(c => c.valor), 1);
    this.maxEstoqueCategoria = max;
  }

  get totalItens(): number {
    return this.produtos.reduce((acc, p) => acc + p.estoqueAtual, 0);
  }

  get valorTotalEstoque(): number {
    return this.produtos.reduce((acc, p) => acc + (p.estoqueAtual * p.precoVenda), 0);
  }

  inicializarGrafico(): void {
    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('dashboardChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.categoriasData.map(c => c.nome),
            datasets: [{
              label: 'Unidades em Estoque',
              data: this.categoriasData.map(c => c.valor),
              backgroundColor: ['#1b365d', '#3498db', '#2ecc71', '#e67e22', '#9b59b6']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  }
}