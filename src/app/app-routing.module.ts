import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelecionarPerfilComponent } from './pages/selecionar-perfil/selecionar-perfil.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProdutoFormComponent } from './pages/produto-form/produto-form.component';
import { CompradorComponent } from './pages/comprador/comprador.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { GuardaAutenticacao } from './guards/guarda-autenticacao.guard';

const routes: Routes = [
  { path: '', redirectTo: 'selecionar-perfil', pathMatch: 'full' },
  { path: 'selecionar-perfil', component: SelecionarPerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sobre', component: SobreComponent },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [GuardaAutenticacao], 
    data: { perfil: 'admin' } 
  },
  { 
    path: 'admin/produtos/novo', 
    component: ProdutoFormComponent, 
    canActivate: [GuardaAutenticacao], 
    data: { perfil: 'admin' } 
  },
  { 
    path: 'admin/produtos/editar/:id', 
    component: ProdutoFormComponent, 
    canActivate: [GuardaAutenticacao], 
    data: { perfil: 'admin' } 
  },
  { 
    path: 'buyer', 
    component: CompradorComponent, 
    canActivate: [GuardaAutenticacao], 
    data: { perfil: 'buyer' } 
  },
  { path: '**', redirectTo: 'selecionar-perfil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
