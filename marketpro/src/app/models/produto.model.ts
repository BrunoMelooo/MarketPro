export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  fornecedor: string;
  lote: string;
  dataValidade: string;
  imagemUrl?: string;
}