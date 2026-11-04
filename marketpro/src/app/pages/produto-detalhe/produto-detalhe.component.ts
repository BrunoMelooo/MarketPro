import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})
export class ProdutoDetalheComponent implements OnInit {
  produto?: Produto;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produto = this.produtoService.getProdutoById(id);
  }

  get margemLucro(): string {
    if (!this.produto) return '0%';
    const margem = ((this.produto.precoVenda - this.produto.precoCusto) / this.produto.precoCusto) * 100;
    return margem.toFixed(1) + '%';
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }
}