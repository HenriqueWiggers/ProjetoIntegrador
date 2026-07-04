import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-kanban-sidebar',
  imports: [NgClass],
  templateUrl: './kanban-sidebar.html',
  styleUrl: './kanban-sidebar.css'
})
export class KanbanSidebarComponent implements OnChanges {
  @Input() orders: Order[] = [];
  @Input() selectedOrder: Order | null = null;

  @Output() orderSelected = new EventEmitter<Order>();
  @Output() newOrderClicked = new EventEmitter<void>();
  @Output() deleteOrderClicked = new EventEmitter<number>();

  currentPage = 1;
  readonly pageSize = 10;

  get sortedOrders(): Order[] {
    return [...this.orders].sort((a, b) => {
      const da = a.dataPedido ? new Date(a.dataPedido).getTime() : 0;
      const db = b.dataPedido ? new Date(b.dataPedido).getTime() : 0;
      return db - da;
    });
  }

  get pagedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.orders.length / this.pageSize));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orders']) {
      this.currentPage = 1;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

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
