import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelecionarPerfilComponent } from './pages/selecionar-perfil/selecionar-perfil.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProdutoFormComponent } from './pages/produto-form/produto-form.component';
import { CompradorComponent } from './pages/comprador/comprador.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';

@NgModule({
  declarations: [
    AppComponent,
    SelecionarPerfilComponent,
    AdminComponent,
    ProdutoFormComponent,
    CompradorComponent,
    LoginComponent,
    SobreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
