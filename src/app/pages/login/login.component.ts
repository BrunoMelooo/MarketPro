import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  senha: string = '';
  perfilAlvo: 'admin' | 'buyer' = 'buyer';
  mensagemErro: string | null = null;
  modoDev: boolean = !environment.production;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private servicoAutenticacao: AutenticacaoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.perfilAlvo = params['perfil'] === 'admin' ? 'admin' : 'buyer';

      if (environment.autoPreencherLogin) {
        if (this.perfilAlvo === 'admin') {
          this.email = environment.credenciaisDev.adminEmail;
          this.senha = environment.credenciaisDev.adminSenha;
        } else {
          this.email = environment.credenciaisDev.buyerEmail;
          this.senha = environment.credenciaisDev.buyerSenha;
        }
      } else {
        this.email = '';
        this.senha = '';
      }
    });
  }

  entrar(): void {
    this.mensagemErro = null;
    this.servicoAutenticacao.entrar(this.email, this.senha).subscribe({
      next: (usuario) => {
        if (usuario.perfil === 'admin') {
          this.router.navigate(['/gestao-interna']);
        } else {
          this.router.navigate(['/loja']);
        }
      },
      error: () => {
        this.mensagemErro = 'E-mail ou senha incorretos.';
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/loja']);
  }
}
