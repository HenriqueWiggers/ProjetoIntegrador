import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-kanban-sidebar',
  imports: [NgClass],
  templateUrl: './kanban-sidebar.html',
  styleUrl: './kanban-sidebar.css'
})
export class KanbanSidebarComponent {
  @Input() orders: Order[] = [];
  @Input() selectedOrder: Order | null = null;

  @Output() orderSelected = new EventEmitter<Order>();
  @Output() newOrderClicked = new EventEmitter<void>();
  @Output() deleteOrderClicked = new EventEmitter<number>();

  selectOrder(order: Order) {
    this.orderSelected.emit(order);
  }

  onNewOrder() {
    this.newOrderClicked.emit();
  }

  onDeleteOrder(event: MouseEvent, id: number | undefined) {
    event.stopPropagation();
    if (id !== undefined) {
      this.deleteOrderClicked.emit(id);
    }
  }

  isSelected(order: Order): boolean {
    return this.selectedOrder?.idPedido === order.idPedido;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(price));
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      NAO_INICIADO: 'Não Iniciado',
      PRODUZIDO: 'Produzido',
      INSTALADO: 'Instalado',
      PAGO: 'Pago',
      CANCELADO: 'Cancelado'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAGO': return 'status-pago';
      case 'CANCELADO': return 'status-cancelado';
      case 'INSTALADO': return 'status-instalado';
      case 'PRODUZIDO': return 'status-produzido';
      default: return 'status-nao-iniciado';
    }
  }
}
