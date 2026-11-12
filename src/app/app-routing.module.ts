import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { CompradorComponent } from './pages/comprador/comprador.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { GuardaAutenticacao } from './guards/guarda-autenticacao.guard';

const routes: Routes = [
  { path: '', redirectTo: 'loja', pathMatch: 'full' },
  { path: 'loja', component: CompradorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sobre', component: SobreComponent },
  {
    path: 'gestao-interna',
    component: AdminComponent,
    canActivate: [GuardaAutenticacao],
    data: { perfil: 'admin' }
  },
  { path: '**', redirectTo: 'loja' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
