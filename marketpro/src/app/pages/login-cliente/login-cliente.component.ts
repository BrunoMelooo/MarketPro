import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-cliente',
  templateUrl: './login-cliente.component.html',
  styleUrls: ['./login-cliente.component.css']
})
export class LoginClienteComponent {
  email = 'cliente@email.com';
  senha = '';
  nomeCliente = 'Cliente Especial';
  erro = '';

  constructor(private router: Router) {}

  entrarComoCliente(): void {
    if (this.email && this.senha) {
      localStorage.setItem('clienteLogado', this.nomeCliente || 'Cliente');
      this.router.navigate(['/loja']);
    } else {
      this.erro = 'Por favor, informe seu e-mail e senha para realizar compras.';
    }
  }
}