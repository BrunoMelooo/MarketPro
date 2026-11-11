export interface Pedido {
  id?: number;
  usuarioId: number;
  nomeUsuario: string;
  valorTotal: number;
  data: string;
  status: string;
  metodoPagamento: string;
}
