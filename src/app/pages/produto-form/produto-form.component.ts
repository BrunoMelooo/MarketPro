import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {
  isEdicao = false;
  produto: Produto = {
    id: 0,
    codigo: '',
    nome: '',
    categoria: 'Laticínios',
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 10,
    fornecedor: '',
    lote: '',
    dataValidade: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      const prodExistente = this.produtoService.getProdutoById(Number(id));
      if (prodExistente) {
        this.produto = { ...prodExistente };
      }
    }
  }

  salvar(): void {
    if (this.isEdicao) {
      this.produtoService.atualizarProduto(this.produto);
    } else {
      this.produtoService.adicionarProduto(this.produto);
    }
    this.router.navigate(['/produtos']);
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }
}