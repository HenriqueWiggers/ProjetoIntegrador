import { Component, inject, OnInit, signal } from '@angular/core';
import { Order } from './models/order.model';
import { OrderService } from './services/order.service';
import { KanbanSidebarComponent } from './components/kanban-sidebar/kanban-sidebar';
import { OrderFormComponent } from './components/order-form/order-form';

@Component({
  selector: 'app-root',
  imports: [KanbanSidebarComponent, OrderFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  onOrderSelected(order: Order): void {
    this.selectedOrder.set(order);
  }

  onNewOrder(): void {
    this.selectedOrder.set(null);
  }

  onSaveOrder(order: Order): void {
    if (order.idPedido !== undefined) {
      this.orderService.updateOrder(order).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('Failed to update order', err)
      });
    } else {
      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.loadOrders();
          this.selectedOrder.set(null);
        },
        error: (err) => console.error('Failed to create order', err)
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
      error: (err) => console.error('Failed to delete order', err)
    });
  }
}
