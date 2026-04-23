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
  @Output() adicionarCoifa = new EventEmitter<void>();

  statuses = ORDER_STATUSES;
  dataPedidoEditavel = false;

  form: FormGroup = this.fb.group({
    nomCliente:   ['', [Validators.required, Validators.maxLength(30)]],
    foneCliente:  ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    foneCliente2: ['', Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
    obsPedido:    [''],
    dataPedido:   [this.todayStr(), Validators.required],
    dataEntrega:  ['', Validators.required],
    statusPedido: ['NAO_INICIADO', Validators.required],
    preco:        [0, [Validators.required, Validators.min(0)]],
    pago:         [false]
  });

  get isEditing(): boolean {
    return this.selectedOrder !== null && this.selectedOrder.idPedido !== undefined;
  }

  get showPagoCheckbox(): boolean {
    const status = this.form.get('statusPedido')?.value;
    return ['NAO_INICIADO', 'PRODUZIDO', 'INSTALADO'].includes(status);
  }

  get nomClienteLength(): number {
    return this.form.get('nomCliente')?.value?.length ?? 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOrder']) {
      this.dataPedidoEditavel = false;
      if (this.selectedOrder) {
        this.form.patchValue(this.selectedOrder);
        this.formatPhoneControls();
      } else {
        this.form.reset({ statusPedido: 'NAO_INICIADO', preco: 0, dataPedido: this.todayStr() });
      }
    }
  }

  onPhoneInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.applyPhoneMask(input.value);
    this.form.get(controlName)?.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  formatDateDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  onDataSelecionada(): void {
    this.dataPedidoEditavel = false;
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

  onAdicionarCoifa(): void {
    this.adicionarCoifa.emit();
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

  private todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  private applyPhoneMask(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2)  return digits;
    if (digits.length <= 7)  return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  private formatPhoneControls(): void {
    ['foneCliente', 'foneCliente2'].forEach(ctrl => {
      const val = this.form.get(ctrl)?.value;
      if (val) this.form.get(ctrl)?.setValue(this.applyPhoneMask(val), { emitEvent: false });
    });
  }
}
