import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-loja',
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.css']
})
export class LojaComponent implements OnInit {
  produtos: Produto[] = [];
  carrinho: ItemCarrinho[] = [];
  metodoPagamento: string = 'PIX';
  compraFinalizada = false;
  mensagemErro = '';
  clienteNome = localStorage.getItem('clienteLogado') || 'Comprador';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtos = this.produtoService.getProdutos();
  }

  adicionarAoCarrinho(prod: Produto): void {
    if (prod.estoqueAtual <= 0) {
      alert('Produto indisponível no estoque!');
      return;
    }

    const itemExistente = this.carrinho.find(i => i.produto.id === prod.id);
    if (itemExistente) {
      if (itemExistente.quantidade < prod.estoqueAtual) {
        itemExistente.quantidade++;
      } else {
        alert(`Quantidade máxima em estoque atingida para ${prod.nome}!`);
      }
    } else {
      this.carrinho.push({ produto: prod, quantidade: 1 });
    }
  }

  removerDoCarrinho(idProduto: number): void {
    this.carrinho = this.carrinho.filter(i => i.produto.id !== idProduto);
  }

  get totalCarrinho(): number {
    return this.carrinho.reduce((total, i) => total + (i.produto.precoVenda * i.quantidade), 0);
  }

  realizarPagamentoFicticio(): void {
    if (this.carrinho.length === 0) {
      this.mensagemErro = 'Seu carrinho está vazio!';
      return;
    }

    const itensParaCompra = this.carrinho.map(i => ({
      idProduto: i.produto.id,
      quantidade: i.quantidade
    }));

    const sucesso = this.produtoService.realizarCompra(itensParaCompra);

    if (sucesso) {
      this.compraFinalizada = true;
      this.carrinho = [];
      this.carregarProdutos(); // Atualiza a lista de estoque em tela
    } else {
      this.mensagemErro = 'Falha ao processar compra: Estoque insuficiente em um dos itens.';
    }
  }

  novaCompra(): void {
    this.compraFinalizada = false;
    this.mensagemErro = '';
  }
}