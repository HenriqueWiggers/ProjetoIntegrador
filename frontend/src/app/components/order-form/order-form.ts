import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, ORDER_STATUSES } from '../../models/order.model';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() selectedOrder: Order | null = null;
  @Output() saveOrder = new EventEmitter<Order>();
  @Output() deleteOrder = new EventEmitter<number>();

  statuses = ORDER_STATUSES;

  form: FormGroup = this.fb.group({
    nomCliente:   ['', Validators.required],
    foneCliente:  ['', Validators.required],
    foneCliente2: [''],
    obsPedido:    [''],
    dataPedido:   ['', Validators.required],
    dataEntrega:  ['', Validators.required],
    statusPedido: ['NAO_INICIADO', Validators.required],
    preco:        [0, [Validators.required, Validators.min(0)]]
  });

  get isEditing(): boolean {
    return this.selectedOrder !== null && this.selectedOrder.idPedido !== undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOrder']) {
      if (this.selectedOrder) {
        this.form.patchValue(this.selectedOrder);
      } else {
        this.form.reset({ statusPedido: 'NAO_INICIADO', preco: 0 });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const orderData: Order = { ...this.form.value };

    if (this.isEditing) {
      orderData.idPedido = this.selectedOrder!.idPedido;
    }

    this.saveOrder.emit(orderData);
  }

  onDelete(): void {
    if (this.selectedOrder?.idPedido !== undefined) {
      this.deleteOrder.emit(this.selectedOrder.idPedido);
    }
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      NAO_INICIADO: 'Não Iniciado',
      PRODUZIDO: 'Produzido',
      INSTALADO: 'Instalado',
      PAGO: 'Pago',
      CANCELADO: 'Cancelado'
    };
    return labels[status] ?? status;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
