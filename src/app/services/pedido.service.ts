import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private urlApi = 'http://localhost:3000/pedidos';

  constructor(private http: HttpClient) {}

  obterPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.urlApi);
  }

  criarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.urlApi, pedido);
  }
}
