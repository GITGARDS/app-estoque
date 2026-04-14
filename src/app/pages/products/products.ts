import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { InventoryService, Product } from "../../services/inventory";

@Component({
  selector: 'app-products',
  imports: [CommonModule, MatIconModule, MatButtonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-8">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Produtos</h1>
          <p class="text-slate-500">Gerencie seu catálogo de itens.</p>
        </div>
        <button mat-flat-button color="primary" class="rounded-xl px-6 py-6" (click)="showAddForm.set(true)">
          <mat-icon class="mr-2">add</mat-icon>
          Novo Produto
        </button>
      </div>

      <!-- Add Form Modal (Simple Inline for now) -->
      @if (showAddForm()) {
        <div class="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-xl space-y-4">
          <h3 class="text-xl font-bold">Cadastrar Novo Produto</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input [(ngModel)]="newProduct.name" placeholder="Nome do Produto" class="p-3 border rounded-xl">
            <input [(ngModel)]="newProduct.category" placeholder="Categoria" class="p-3 border rounded-xl">
            <input [(ngModel)]="newProduct.price" type="number" placeholder="Preço" class="p-3 border rounded-xl">
            <input [(ngModel)]="newProduct.stock" type="number" placeholder="Estoque Inicial" class="p-3 border rounded-xl">
            <input [(ngModel)]="newProduct.minStock" type="number" placeholder="Estoque Mínimo" class="p-3 border rounded-xl">
          </div>
          <div class="flex justify-end gap-3">
            <button (click)="showAddForm.set(false)" class="px-6 py-2 text-slate-500">Cancelar</button>
            <button (click)="saveProduct()" class="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold">Salvar</button>
          </div>
        </div>
      }

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of inventory.products(); track p.id) {
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="h-40 bg-slate-100 flex items-center justify-center relative">
              @if (p.imageUrl) {
                <img [src]="p.imageUrl" [alt]="p.name" class="w-full h-full object-cover">
              } @else {
                <mat-icon class="scale-[3] text-slate-300">image</mat-icon>
              }
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                {{ p.category }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-slate-900">{{ p.name }}</h3>
              <p class="text-slate-500 text-sm mt-1 line-clamp-1">{{ p.description || 'Sem descrição' }}</p>
              
              <div class="mt-6 flex justify-between items-end">
                <div>
                  <p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Preço</p>
                  <p class="text-xl font-bold text-emerald-600">{{ p.price | currency:'BRL' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Estoque</p>
                  <p [class]="p.stock <= p.minStock ? 'text-amber-600' : 'text-slate-900'" class="text-xl font-bold">
                    {{ p.stock }} un
                  </p>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                <button class="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                        (click)="openMovement(p, 'IN')">
                  Entrada
                </button>
                <button class="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                        (click)="openMovement(p, 'OUT')">
                  Saída
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Movement Modal (Simple Inline) -->
    @if (activeMovement()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
          <h3 class="text-2xl font-bold">
            Registrar {{ activeMovement()?.type === 'IN' ? 'Entrada' : 'Saída' }}
          </h3>
          <p class="text-slate-500">Produto: <span class="font-bold text-slate-900">{{ activeMovement()?.product?.name }}</span></p>
          
          <div class="space-y-4">
            <div>
              <label for="qty" class="block text-sm font-bold text-slate-700 mb-1">Quantidade</label>
              <input id="qty" type="number" [(ngModel)]="movementQty" class="w-full p-4 border-2 rounded-2xl focus:border-emerald-500 outline-none text-xl font-bold">
            </div>
            <div>
              <label for="reason" class="block text-sm font-bold text-slate-700 mb-1">Motivo</label>
              <textarea id="reason" [(ngModel)]="movementReason" class="w-full p-4 border-2 rounded-2xl focus:border-emerald-500 outline-none h-24"></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button (click)="activeMovement.set(null)" class="flex-1 py-4 text-slate-500 font-bold">Cancelar</button>
            <button (click)="confirmMovement()" class="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export default class Products {
  inventory = inject(InventoryService);
  showAddForm = signal(false);
  activeMovement = signal<{product: Product, type: 'IN' | 'OUT'} | null>(null);
  
  newProduct: Partial<Product> = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    minStock: 5
  };

  movementQty = 1;
  movementReason = '';

  async saveProduct() {
    if (!this.newProduct.name) return;
    await this.inventory.addProduct(this.newProduct as Product);
    this.showAddForm.set(false);
    this.newProduct = { name: '', category: '', price: 0, stock: 0, minStock: 5 };
  }

  openMovement(product: Product, type: 'IN' | 'OUT') {
    this.activeMovement.set({ product, type });
    this.movementQty = 1;
    this.movementReason = '';
  }

  async confirmMovement() {
    const active = this.activeMovement();
    if (!active || !active.product.id) return;

    try {
      await this.inventory.registerMovement(
        active.product.id,
        active.product.name,
        active.type,
        this.movementQty,
        this.movementReason
      );
      this.activeMovement.set(null);
    } catch (e) {
      const error = e as Error;
      alert(error.message);
    }
  }
}
