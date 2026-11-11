import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';

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

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private servicoAutenticacao: AutenticacaoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['perfil']) {
        this.perfilAlvo = params['perfil'];
        if (this.perfilAlvo === 'admin') {
          this.email = 'bruno@marketpro.com';
          this.senha = '123';
        } else {
          this.email = 'cliente@marketpro.com';
          this.senha = '123';
        }
      }
    });
  }

  entrar(): void {
    this.servicoAutenticacao.entrar(this.email, this.senha).subscribe({
      next: (usuario) => {
        if (usuario.perfil === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/buyer']);
        }
      },
      error: () => {
        this.mensagemErro = 'Email ou senha incorretos.';
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/selecionar-perfil']);
  }
}
