import { Component, inject, OnInit, signal } from '@angular/core';
import { Order } from './models/order.model';
import { OrderService } from './services/order.service';
import { KanbanSidebarComponent } from './components/kanban-sidebar/kanban-sidebar';
import { OrderFormComponent } from './components/order-form/order-form';
import { CoifaFormComponent } from './components/coifa-form/coifa-form';

@Component({
  selector: 'app-root',
  imports: [KanbanSidebarComponent, OrderFormComponent, CoifaFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  currentView = signal<'pedidos' | 'coifa'>('pedidos');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Erro ao carregar pedidos', err)
    });
  }

  onOrderSelected(order: Order): void {
    this.selectedOrder.set(order);
  }

  onNewOrder(): void {
    this.selectedOrder.set(null);
    this.currentView.set('pedidos');
  }

  onNavigateToCoifa(): void {
    this.currentView.set('coifa');
    this.selectedOrder.set(null);
  }

  onVoltarParaPedidos(): void {
    this.currentView.set('pedidos');
  }

  onSaveOrder(order: Order): void {
    if (order.idPedido !== undefined) {
      this.orderService.updateOrder(order).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('Erro ao atualizar pedido', err)
      });
    } else {
      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.loadOrders();
          this.selectedOrder.set(null);
        },
        error: (err) => console.error('Erro ao criar pedido', err)
      });
    }
  }

  onDeleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.idPedido !== id));
        if (this.selectedOrder()?.idPedido === id) {
          this.selectedOrder.set(null);
        }
      },
      error: (err) => console.error('Erro ao excluir pedido', err)
    });
  }
}
