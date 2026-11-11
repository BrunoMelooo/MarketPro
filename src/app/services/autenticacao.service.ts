import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlApi = 'http://localhost:3000/usuarios';
  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioAtual$ = this.usuarioAtualSubject.asObservable();

  constructor(private http: HttpClient) {
    const usuarioSalvo = localStorage.getItem('usuarioAtual');
    if (usuarioSalvo) {
      this.usuarioAtualSubject.next(JSON.parse(usuarioSalvo));
    }
  }

  public get valorUsuarioAtual(): Usuario | null {
    return this.usuarioAtualSubject.value;
  }

  cadastrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApi, usuario);
  }

  entrar(email: string, senha?: string): Observable<Usuario> {
    return this.http.get<Usuario[]>(`${this.urlApi}?email=${email}`).pipe(
      map(usuarios => {
        const usuarioEncontrado = usuarios.find(u => u.email === email && (!senha || u.senha === senha));
        if (usuarioEncontrado) {
          localStorage.setItem('usuarioAtual', JSON.stringify(usuarioEncontrado));
          this.usuarioAtualSubject.next(usuarioEncontrado);
          return usuarioEncontrado;
        } else {
          throw new Error('Credenciais inválidas');
        }
      })
    );
  }

  sair(): void {
    localStorage.removeItem('usuarioAtual');
    this.usuarioAtualSubject.next(null);
  }

  estaAutenticado(): boolean {
    return !!this.valorUsuarioAtual;
  }

  obterPerfil(): 'admin' | 'buyer' | null {
    return this.valorUsuarioAtual ? this.valorUsuarioAtual.perfil : null;
  }
}
