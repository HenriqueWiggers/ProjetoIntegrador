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

  selectOrder(order: Order) {
    this.orderSelected.emit(order);
  }

  onNewOrder() {
    this.newOrderClicked.emit();
  }

  isSelected(order: Order): boolean {
    return this.selectedOrder?.idPedido === order.idPedido;
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
