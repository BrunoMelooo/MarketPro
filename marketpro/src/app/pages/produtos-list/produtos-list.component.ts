import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produtos-list',
  templateUrl: './produtos-list.component.html',
  styleUrls: ['./produtos-list.component.css']
})
export class ProdutosListComponent implements OnInit {
  produtos: Produto[] = [];
  termoBusca: string = '';
  categoriaFiltro: string = 'Todas';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtos = this.produtoService.getProdutos();
  }

  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(p => {
      const bateNome = p.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
                       p.codigo.toLowerCase().includes(this.termoBusca.toLowerCase());
      const bateCat = this.categoriaFiltro === 'Todas' || p.categoria === this.categoriaFiltro;
      return bateNome && bateCat;
    });
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.produtoService.excluirProduto(id);
      this.carregarProdutos();
    }
  }
}