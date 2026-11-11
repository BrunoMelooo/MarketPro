import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-selecionar-perfil',
  templateUrl: './selecionar-perfil.component.html',
  styleUrls: ['./selecionar-perfil.component.css']
})
export class SelecionarPerfilComponent {
  constructor(private router: Router, private servicoAutenticacao: AutenticacaoService) {}

  selecionarModo(perfil: 'admin' | 'buyer') {
    if (this.servicoAutenticacao.estaAutenticado() && this.servicoAutenticacao.obterPerfil() === perfil) {
      this.router.navigate([`/${perfil}`]);
    } else {
      this.router.navigate(['/login'], { queryParams: { perfil } });
    }
  }

  irParaSobre() {
    this.router.navigate(['/sobre']);
  }
}
