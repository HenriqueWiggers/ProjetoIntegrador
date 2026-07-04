import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoifaViewerComponent } from '../coifa-viewer/coifa-viewer';
import { CoifaService } from '../../services/coifa.service';
import { Order } from '../../models/order.model';
import { Coifa } from '../../models/coifa.model';

@Component({
  selector: 'app-coifa-form',
  imports: [ReactiveFormsModule, CoifaViewerComponent],
  templateUrl: './coifa-form.html',
  styleUrl: './coifa-form.css'
})
export class CoifaFormComponent implements OnChanges {
  private fb            = inject(FormBuilder);
  private coifaService  = inject(CoifaService);

  @Input() selectedOrder: Order | null = null;
  @Output() voltar      = new EventEmitter<void>();
  @Output() coifaSalva  = new EventEmitter<void>();

  saving = false;
  saveError = '';
  saveSuccess = false;

  form: FormGroup = this.fb.group({
    altura:           [null, [Validators.required, Validators.min(1)]],
    largura:          [null, [Validators.required, Validators.min(1)]],
    profundidade:     [null, [Validators.required, Validators.min(1)]],
    bocaLargura:      [null, [Validators.required, Validators.min(1)]],
    bocaProfundidade: [null, [Validators.required, Validators.min(1)]],
    bocaCima:         [null, [Validators.required, Validators.min(0)]],
    bocaLado:         [null, [Validators.required, Validators.min(0)]]
  });

  // ── Viewer bindings ──────────────────────────────────────────────────────────

  get alturaValue():           number { return +(this.form.get('altura')?.value)           || 0; }
  get larguraValue():          number { return +(this.form.get('largura')?.value)          || 0; }
  get profundidadeValue():     number { return +(this.form.get('profundidade')?.value)     || 0; }
  get bocaLarguraValue():      number { return +(this.form.get('bocaLargura')?.value)      || 0; }
  get bocaProfundidadeValue(): number { return +(this.form.get('bocaProfundidade')?.value) || 0; }
  get bocaCimaValue():         number { return +(this.form.get('bocaCima')?.value)         || 0; }
  get bocaLadoValue():         number { return +(this.form.get('bocaLado')?.value)         || 0; }

  // ── Pedido context ───────────────────────────────────────────────────────────

  get pedidoNome(): string {
    return this.selectedOrder?.nomCliente ?? '';
  }

  get podeSalvar(): boolean {
    return !!this.selectedOrder?.idPedido;
  }

  get tooltipSalvar(): string {
    if (!this.selectedOrder) return 'Nenhum pedido selecionado';
    if (!this.selectedOrder.idPedido) return 'Salve o pedido antes de adicionar a coifa';
    return '';
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOrder']) {
      this.saveError   = '';
      this.saveSuccess = false;
      const coifa = this.selectedOrder?.coifa;
      if (coifa) {
        this.form.patchValue({
          altura:           coifa.altura,
          largura:          coifa.largura,
          profundidade:     coifa.comprimento,
          bocaLargura:      coifa.bocaLargura      ?? null,
          bocaProfundidade: coifa.bocaProfundidade ?? null,
          bocaLado:         coifa.bocalPosX        ?? 0,
          bocaCima:         coifa.bocalPosY        ?? 0,
        });
      } else {
        this.form.reset({
          bocaLargura:      10,
          bocaProfundidade: 10,
          bocaCima:         0,
          bocaLado:         0,
        });
      }
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  onSalvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.podeSalvar) return;

    const v = this.form.value;
    const payload: Coifa = {
      largura:          v.largura,
      comprimento:      v.profundidade,
      altura:           v.altura,
      bocaLargura:      v.bocaLargura,
      bocaProfundidade: v.bocaProfundidade,
      bocalPosX:        v.bocaLado,
      bocalPosY:        v.bocaCima,
      pedido:           { idPedido: this.selectedOrder!.idPedido! }
    };

    const existingId = this.selectedOrder?.coifa?.idCoifa;
    if (existingId) payload.idCoifa = existingId;

    this.saving      = true;
    this.saveError   = '';
    this.saveSuccess = false;

    const req$ = existingId
      ? this.coifaService.update(payload)
      : this.coifaService.create(payload);

    req$.subscribe({
      next: () => {
        this.saving      = false;
        this.saveSuccess = true;
        this.coifaSalva.emit();
        setTimeout(() => { this.saveSuccess = false; }, 3000);
      },
      error: (err) => {
        this.saving    = false;
        this.saveError = err?.error?.message ?? 'Erro ao salvar coifa.';
      }
    });
  }

  onVoltar(): void {
    this.voltar.emit();
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
