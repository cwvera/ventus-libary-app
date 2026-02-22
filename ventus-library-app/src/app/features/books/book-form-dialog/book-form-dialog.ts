import { Component, Inject, OnInit, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CrudService } from '@ventus/core/services/crud';
import { BookDto, GenreDto, AuthorDto } from '@ventus/shared/interfaces';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialog } from '@ventus/shared/confirm-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './book-form-dialog.html',
})
export class BookFormDialog implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly crud = inject<CrudService<BookDto>>(CrudService);
  private readonly crudGenres = inject<CrudService<GenreDto>>(CrudService);
  private readonly crudAuthors = inject<CrudService<AuthorDto>>(CrudService);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    publicationYear: [null as number | null, [Validators.required]],
    ac: [false],
    pageCount: [null as number | null, [Validators.required, Validators.min(1)]],
    authorId: [null as number | null, [Validators.required]],
    genreId: [null as number | null, [Validators.required]],
  });

  protected id: number | null = null;
  protected genres: GenreDto[] = [];
  protected authors: AuthorDto[] = [];
  protected genres$?: import('rxjs').Observable<GenreDto[]>;
  protected authors$?: import('rxjs').Observable<AuthorDto[]>;
  protected saving = false;
  protected hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<BookFormDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number | null },
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    this.id = data.id;
  }

  /**
   * Inicializa el diálogo y precarga datos si existe id.
   * @summary Carga catálogos y prepara el formulario para edición/alta.
   * @returns void
   */
  ngOnInit(): void {
    this.genres$ = this.crudGenres.getAll('/api/v1/genres');
    this.authors$ = this.crudAuthors.getAll('/api/v1/authors');
    this.loadGenres();
    this.loadAuthors();
    if (this.id) {
      this.crud.getById('/api/v1/books', this.id).subscribe((book: BookDto | null) => {
        if (!book) return;
        const ac = book.publicationYear < 0;
        const absYear = ac ? Math.abs(book.publicationYear) : book.publicationYear;
        this.form.patchValue({
          title: book.title,
          description: book.description ?? '',
          publicationYear: absYear,
          ac,
          pageCount: book.pageCount ?? null,
          authorId: book.authorId,
          genreId: book.genreId,
        });
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
   * Confirma y guarda el libro (crear o actualizar).
   * @summary Abre confirmación y realiza POST/PUT con payload parcial.
   * @returns void
   * @link /api/v1/books
   */
  protected save(): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: this.id ? 'Confirmar actualización' : 'Confirmar registro',
        message: this.id ? '¿Actualizar este libro?' : '¿Registrar este libro?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok || this.form.invalid) return;
      const value = this.form.value as any;
      const payload: Partial<BookDto> = {
        id: this.id ?? undefined,
        title: value.title,
        description: value.description || undefined,
        publicationYear: value.ac ? -Math.abs(value.publicationYear) : Number(value.publicationYear),
        pageCount: Number(value.pageCount),
        authorId: Number(value.authorId),
        genreId: Number(value.genreId),
      };
      this.saving = true;
      const obs = this.id
        ? this.crud.update('/api/v1/books', this.id, payload)
        : this.crud.create('/api/v1/books', payload);
      obs.subscribe({
        next: () => {
          this.snack.open('Libro guardado exitosamente', 'Cerrar', { duration: 3000 });
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
          const msg = [general, ...details].filter(Boolean).join(' • ') || 'Error al guardar el libro';
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

  /**
   * Carga catálogo de géneros.
   * @summary Actualiza arreglo interno de géneros.
   * @returns void
   * @link /api/v1/genres
   */
  private loadGenres(): void {
    this.crudGenres.getAll('/api/v1/genres').subscribe((items: GenreDto[]) => {
      this.genres = items;
    });
  }

  /**
   * Carga catálogo de autores.
   * @summary Actualiza arreglo interno de autores.
   * @returns void
   * @link /api/v1/authors
   */
  private loadAuthors(): void {
    this.crudAuthors.getAll('/api/v1/authors').subscribe((items: AuthorDto[]) => {
      this.authors = items;
    });
  }
}

