import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { InventoryService } from "../../services/inventory";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, CurrencyPipe],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p class="text-slate-500">Visão geral do seu estoque em tempo real.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total de Produtos</p>
              <p class="text-2xl font-bold text-slate-900">{{ inventory.products().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <mat-icon>payments</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Valor em Estoque</p>
              <p class="text-2xl font-bold text-slate-900">{{ totalValue() | currency:'BRL' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <mat-icon>warning</mat-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Estoque Baixo</p>
              <p class="text-2xl font-bold text-slate-900">{{ lowStockItems().length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Movements -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-slate-900">Movimentações Recentes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 font-semibold">Produto</th>
                <th class="px-6 py-4 font-semibold">Tipo</th>
                <th class="px-6 py-4 font-semibold">Qtd</th>
                <th class="px-6 py-4 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (m of inventory.movements().slice(0, 5); track m.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900">{{ m.productName }}</td>
                  <td class="px-6 py-4">
                    <span [class]="m.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                          class="px-2 py-1 rounded-full text-xs font-bold">
                      {{ m.type === 'IN' ? 'ENTRADA' : 'SAÍDA' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-600">{{ m.quantity }}</td>
                  <td class="px-6 py-4 text-slate-500 text-sm">{{ m.timestamp.toDate() | date:'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-10 text-center text-slate-400 italic">Nenhuma movimentação registrada.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export default class Dashboard {
  inventory = inject(InventoryService);

  totalValue = computed(() => {
    return this.inventory.products().reduce((acc, p) => acc + (p.price * p.stock), 0);
  });

  lowStockItems = computed(() => {
    return this.inventory.products().filter(p => p.stock <= p.minStock);
  });
}
