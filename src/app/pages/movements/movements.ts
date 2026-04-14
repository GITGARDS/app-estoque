import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { InventoryService } from "../../services/inventory";

@Component({
  selector: 'app-movements',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Movimentações</h1>
        <p class="text-slate-500">Histórico completo de entradas e saídas do estoque.</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4 font-semibold">Data e Hora</th>
                <th class="px-6 py-4 font-semibold">Produto</th>
                <th class="px-6 py-4 font-semibold">Tipo</th>
                <th class="px-6 py-4 font-semibold">Quantidade</th>
                <th class="px-6 py-4 font-semibold">Motivo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (m of inventory.movements(); track m.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 text-slate-500 text-sm">
                    {{ m.timestamp.toDate()  | date:'dd/MM/yyyy HH:mm:ss' }}
                  </td>
                  <td class="px-6 py-4 font-medium text-slate-900">{{ m.productName }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <mat-icon [class]="m.type === 'IN' ? 'text-emerald-500' : 'text-red-500'" class="scale-75">
                        {{ m.type === 'IN' ? 'arrow_downward' : 'arrow_upward' }}
                      </mat-icon>
                      <span [class]="m.type === 'IN' ? 'text-emerald-700' : 'text-red-700'" class="font-bold text-sm">
                        {{ m.type === 'IN' ? 'ENTRADA' : 'SAÍDA' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-900 font-bold">{{ m.quantity }}</td>
                  <td class="px-6 py-4 text-slate-500 italic text-sm">{{ m.reason || '-' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-20 text-center">
                    <mat-icon class="scale-[2] text-slate-200 mb-4">history</mat-icon>
                    <p class="text-slate-400">Nenhuma movimentação encontrada.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export default class Movements {
  inventory = inject(InventoryService);
}
