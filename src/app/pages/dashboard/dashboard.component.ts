import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  produtos: Produto[] = [];
  produtosCriticos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtos = this.produtoService.getProdutos();
    this.produtosCriticos = this.produtoService.getProdutosEstoqueBaixo();
  }

  get totalItens(): number {
    return this.produtos.reduce((acc, p) => acc + p.estoqueAtual, 0);
  }

  get valorTotalEstoque(): number {
    return this.produtos.reduce((acc, p) => acc + (p.estoqueAtual * p.precoVenda), 0);
  }
}