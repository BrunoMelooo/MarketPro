import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {
  modoEdicao: boolean = false;
  produtoId: number | null = null;
  
  produto: Produto = {
    nome: '',
    preco: 0,
    estoque: 0,
    categoria: '',
    imagemUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop'
  };

  presetImagens: { label: string; url: string }[] = [
    { label: 'Arroz / Grãos', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop' },
    { label: 'Feijão / Leguminosas', url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&auto=format&fit=crop' },
    { label: 'Azeite / Óleo', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop' },
    { label: 'Detergente / Limpeza', url: 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=400&auto=format&fit=crop' },
    { label: 'Café', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop' },
    { label: 'Leite / Laticínios', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop' },
    { label: 'Frutas / Hortifrúti', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop' },
    { label: 'Pães / Padaria', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicoProduto: ProdutoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicao = true;
      this.produtoId = Number(idParam);
      this.servicoProduto.obterProdutoPorId(this.produtoId).subscribe(dados => {
        this.produto = dados;
      });
    }
  }

  selecionarPreset(url: string): void {
    this.produto.imagemUrl = url;
  }

  salvar(): void {
    if (!this.produto.nome || this.produto.preco <= 0) return;

    if (!this.produto.imagemUrl) {
      this.produto.imagemUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop';
    }

    if (this.modoEdicao && this.produtoId) {
      this.servicoProduto.atualizarProduto(this.produtoId, this.produto).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    } else {
      this.servicoProduto.adicionarProduto(this.produto).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin']);
  }
}
