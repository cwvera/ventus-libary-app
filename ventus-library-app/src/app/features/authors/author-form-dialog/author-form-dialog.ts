import { Component, Inject, OnInit, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '@ventus/shared/confirm-dialog';
import { AuthorDto } from '@ventus/shared/interfaces';
import { CrudService } from '@ventus/core/services/crud';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-author-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './author-form-dialog.html',
})
export class AuthorFormDialog implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly crud = inject<CrudService<AuthorDto>>(CrudService);
  private readonly snack = inject(MatSnackBar);

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    birthDate: [''],
    city: [''],
    email: ['', [Validators.email]],
  });

  protected id: number | null = null;
  protected saving = false;
  protected hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<AuthorFormDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number | null },
    private dialog: MatDialog
  ) {
    this.id = data.id;
  }

  /**
   * Inicializa el diálogo y precarga datos si existe id.
   * @summary Carga el autor desde la API y rellena el formulario.
   * @returns void
   * @link /api/v1/authors/{id}
   */
  ngOnInit(): void {
    if (this.id) {
      this.crud.getById('/api/v1/authors', this.id).subscribe((author: AuthorDto | null) => {
        if (author) {
          this.form.patchValue({
            fullName: (author as any).fullName ?? (author as any).name ?? '',
            description: (author as any).description ?? '',
            birthDate: (author as any).birthDate ?? '',
            city: (author as any).city ?? '',
            email: author.email ?? '',
          });
        }
      });
    }
  }
  
  /**
   * Suscribe cambios del formulario para detectar modificaciones.
   * @summary Marca hasChanges cuando el usuario edita campos.
   * @returns void
   */
  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.hasChanges = true;
    });
  }

  /**
   * Confirma y guarda el autor (crear o actualizar).
   * @summary Abre confirmación y realiza POST/PUT con payload parcial.
   * @returns void
   * @link /api/v1/authors
   */
  protected save(): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: this.id ? 'Confirmar actualización' : 'Confirmar registro',
        message: this.id ? '¿Actualizar este autor?' : '¿Registrar este autor?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok || this.form.invalid) return;
      const v = this.form.value as any;
      const payload: Partial<AuthorDto> = {
        id: this.id ?? undefined,
        fullName: v.fullName,
        description: v.description || undefined,
        birthDate: v.birthDate || undefined,
        city: v.city || undefined,
        email: v.email || undefined,
      };
      this.saving = true;
      const obs = this.id
        ? this.crud.update('/api/v1/authors', this.id, payload)
        : this.crud.create('/api/v1/authors', payload);
      obs.subscribe({
        next: () => {
          this.snack.open('Autor guardado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          const backend = err?.error as {
            message?: string;
            errors?: Array<{ PropertyName?: string; ErrorMessage?: string }>;
          };
          const general = backend?.message;
          const details = Array.isArray(backend?.errors)
            ? backend!.errors!.map((e) => e.ErrorMessage).filter(Boolean)
            : [];
          const msg = [general, ...details].filter(Boolean).join(' • ') || 'Error al guardar el autor';
          this.snack.open(msg, 'Cerrar', { duration: 6000 });
          this.saving = false;
        },
        complete: () => {
          this.saving = false;
        },
      });
    });
  }

  /**
   * Confirma y elimina el autor actual.
   * @summary Muestra confirmación y ejecuta DELETE si se acepta.
   * @returns void
   * @link /api/v1/authors/{id}
   */
  protected delete(): void {
    if (!this.id) return;
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Eliminar este autor?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.crud.softDelete('/api/v1/authors', this.id!).subscribe({
        next: () => {
          this.snack.open('Autor eliminado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snack.open('Error al eliminar el autor', 'Cerrar', { duration: 4000 });
        },
      });
    });
  }

  /**
   * Confirma salida si existen cambios sin guardar.
   * @summary Cierra el diálogo o solicita confirmación.
   * @returns void
   */
  protected cancel(): void {
    if (!this.hasChanges) {
      this.dialogRef.close(false);
      return;
    }
    const confirmRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Salir sin guardar',
        message: '¿Seguro desea salir sin guardar?',
        confirmText: 'Salir',
        cancelText: 'Continuar editando',
      },
    });
    confirmRef.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        this.dialogRef.close(false);
      }
    });
  }
}

 
