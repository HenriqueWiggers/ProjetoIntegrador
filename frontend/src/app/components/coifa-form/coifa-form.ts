import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoifaViewerComponent } from '../coifa-viewer/coifa-viewer';

@Component({
  selector: 'app-coifa-form',
  imports: [ReactiveFormsModule, CoifaViewerComponent],
  templateUrl: './coifa-form.html',
  styleUrl: './coifa-form.css'
})
export class CoifaFormComponent {
  private fb = inject(FormBuilder);

  @Output() voltar = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    altura:       [null, [Validators.required, Validators.min(1)]],
    largura:      [null, [Validators.required, Validators.min(1)]],
    profundidade: [null, [Validators.required, Validators.min(1)]],
    bocaX:        [null, [Validators.required, Validators.min(0)]],
    bocaY:        [null, [Validators.required, Validators.min(0)]]
  });

  get alturaValue(): number       { return +(this.form.get('altura')?.value)       || 0; }
  get larguraValue(): number      { return +(this.form.get('largura')?.value)      || 0; }
  get profundidadeValue(): number { return +(this.form.get('profundidade')?.value) || 0; }
  get bocaXValue(): number        { return +(this.form.get('bocaX')?.value)        || 0; }
  get bocaYValue(): number        { return +(this.form.get('bocaY')?.value)        || 0; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Dimensões da coifa:', this.form.value);
    this.form.reset();
  }

  onVoltar(): void {
    this.voltar.emit();
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
