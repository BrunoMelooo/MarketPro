import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtos: Produto[] = [
    { id: 1, codigo: 'PRD-001', nome: 'Leite Integral UHT 1L', categoria: 'Laticínios', precoCusto: 3.20, precoVenda: 4.89, estoqueAtual: 25, estoqueMinimo: 20, fornecedor: 'Laticínios Alvorada LTDA', lote: 'B442', dataValidade: '2026-12-15' },
    { id: 2, codigo: 'PRD-002', nome: 'Arroz Tipo 1 5kg', categoria: 'Mercearia', precoCusto: 18.50, precoVenda: 24.90, estoqueAtual: 45, estoqueMinimo: 15, fornecedor: 'Cerealista Sul', lote: 'A102', dataValidade: '2027-05-10' },
    { id: 3, codigo: 'PRD-003', nome: 'Café Torrado e Moído 500g', categoria: 'Mercearia', precoCusto: 11.00, precoVenda: 16.50, estoqueAtual: 14, estoqueMinimo: 15, fornecedor: 'Café Brasil S.A.', lote: 'C881', dataValidade: '2026-11-30' },
    { id: 4, codigo: 'PRD-004', nome: 'Detergente Neutro 500ml', categoria: 'Limpeza', precoCusto: 1.40, precoVenda: 2.29, estoqueAtual: 88, estoqueMinimo: 30, fornecedor: 'Limpex Indústria', lote: 'L990', dataValidade: '2028-01-01' },
    { id: 5, codigo: 'PRD-005', nome: 'Biscoito Recheado Chocolate 140g', categoria: 'Biscoitos', precoCusto: 2.10, precoVenda: 3.49, estoqueAtual: 32, estoqueMinimo: 20, fornecedor: 'Doces & Cia', lote: 'B112', dataValidade: '2027-02-14' },
    { id: 6, codigo: 'PRD-006', nome: 'Sabão em Pó Ação Profunda 1kg', categoria: 'Limpeza', precoCusto: 8.90, precoVenda: 12.90, estoqueAtual: 19, estoqueMinimo: 10, fornecedor: 'Limpex Indústria', lote: 'S404', dataValidade: '2028-06-20' },
    { id: 7, codigo: 'PRD-007', nome: 'Azeite de Oliva Extra Virgem 500ml', categoria: 'Mercearia', precoCusto: 22.00, precoVenda: 34.90, estoqueAtual: 8, estoqueMinimo: 12, fornecedor: 'Importadora Vale do Sol', lote: 'AZ99', dataValidade: '2027-08-10' },
    { id: 8, codigo: 'PRD-008', nome: 'Queijo Mussarela Fatiado 200g', categoria: 'Laticínios', precoCusto: 6.50, precoVenda: 9.90, estoqueAtual: 5, estoqueMinimo: 15, fornecedor: 'Laticínios Alvorada LTDA', lote: 'QM12', dataValidade: '2026-11-20' },
    { id: 9, codigo: 'PRD-009', nome: 'Refrigerante Cola 2L', categoria: 'Bebidas', precoCusto: 4.50, precoVenda: 7.99, estoqueAtual: 60, estoqueMinimo: 25, fornecedor: 'Bebidas do Vale', lote: 'REF01', dataValidade: '2027-01-15' },
    { id: 10, codigo: 'PRD-010', nome: 'Papel Higiênico Folha Dupla (8 rolos)', categoria: 'Higiene', precoCusto: 9.80, precoVenda: 14.90, estoqueAtual: 40, estoqueMinimo: 15, fornecedor: 'Limpex Indústria', lote: 'PH88', dataValidade: '2029-12-31' }
  ];

  private produtosSubject = new BehaviorSubject<Produto[]>(this.produtos);
  produtos$: Observable<Produto[]> = this.produtosSubject.asObservable();

  constructor() {}

  getProdutos(): Produto[] {
    return [...this.produtos];
  }

  getProdutoById(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  adicionarProduto(produto: Produto): void {
    produto.id = this.produtos.length > 0 ? Math.max(...this.produtos.map(p => p.id)) + 1 : 1;
    this.produtos.push(produto);
    this.produtosSubject.next([...this.produtos]);
  }

  atualizarProduto(produtoAtualizado: Produto): void {
    const index = this.produtos.findIndex(p => p.id === produtoAtualizado.id);
    if (index !== -1) {
      this.produtos[index] = produtoAtualizado;
      this.produtosSubject.next([...this.produtos]);
    }
  }

  excluirProduto(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id);
    this.produtosSubject.next([...this.produtos]);
  }

  realizarCompra(itensCarrinho: { idProduto: number; quantidade: number }[]): boolean {
    for (const item of itensCarrinho) {
      const prod = this.produtos.find(p => p.id === item.idProduto);
      if (!prod || prod.estoqueAtual < item.quantidade) {
        return false;
      }
    }

    for (const item of itensCarrinho) {
      const prod = this.produtos.find(p => p.id === item.idProduto);
      if (prod) {
        prod.estoqueAtual -= item.quantidade;
      }
    }

    this.produtosSubject.next([...this.produtos]);
    return true;
  }

  getProdutosEstoqueBaixo(): Produto[] {
    return this.produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo);
  }

  getProdutosProximosVencimento(): Produto[] {
    return this.produtos.filter(p => p.estoqueAtual < 15);
  }
}