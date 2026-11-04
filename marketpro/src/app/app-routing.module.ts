import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProdutosListComponent } from './pages/produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './pages/produto-form/produto-form.component';
import { ProdutoDetalheComponent } from './pages/produto-detalhe/produto-detalhe.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { LoginClienteComponent } from './pages/login-cliente/login-cliente.component';
import { LojaComponent } from './pages/loja/loja.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'produtos', component: ProdutosListComponent },
  { path: 'produtos/novo', component: ProdutoFormComponent },
  { path: 'produtos/editar/:id', component: ProdutoFormComponent },
  { path: 'produtos/detalhes/:id', component: ProdutoDetalheComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'login-cliente', component: LoginClienteComponent },
  { path: 'loja', component: LojaComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }