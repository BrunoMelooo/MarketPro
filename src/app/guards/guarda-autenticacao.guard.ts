import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class GuardaAutenticacao implements CanActivate {
  constructor(private servicoAutenticacao: AutenticacaoService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const autenticado = this.servicoAutenticacao.estaAutenticado();
    const perfilUsuario = this.servicoAutenticacao.obterPerfil();
    const perfilEsperado = route.data['perfil'];

    if (autenticado) {
      if (perfilEsperado && perfilUsuario !== perfilEsperado) {
        this.router.navigate(['/loja']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { perfil: perfilEsperado } });
    return false;
  }
}
