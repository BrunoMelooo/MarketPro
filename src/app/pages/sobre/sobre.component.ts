import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent {
  nomeProprietario = 'Bruno Melo';
  nomeEmpresa = 'MarketPro Supermercados';

  constructor(public router: Router) {}

  voltar(): void {
    this.router.navigate(['/selecionar-perfil']);
  }
}
