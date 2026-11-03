import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = 'gerente@marketpro.com';
  senha = '';
  mensagemErro = '';

  constructor(private router: Router) {}

  fazerLogin(): void {
    if (this.usuario && this.senha) {
      this.router.navigate(['/dashboard']);
    } else {
      this.mensagemErro = 'Por favor, preencha o usuário e a senha.';
    }
  }
}