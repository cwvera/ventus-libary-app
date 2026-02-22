import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { CrudService } from '@ventus/core/services/crud';
import { BookDto } from '@ventus/shared/interfaces';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '@ventus/shared/confirm-dialog';
import { BookFormDialog } from '../book-form-dialog/book-form-dialog';

@Component({
  selector: 'app-books-list-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './books-list-page.html',
  styleUrl: './books-list-page.css',
})
export class BooksListPage implements OnInit, AfterViewInit {
  private readonly crud = inject<CrudService<BookDto>>(CrudService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected displayedColumns = ['id', 'title', 'authorName', 'genreName', 'actions'];
  protected dataSource = new MatTableDataSource<BookDto>([]);
  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  /**
   * Inicializa el componente y carga los libros.
   * @summary Configura el estado inicial y dispara la carga de datos.
   * @returns void
   */
  ngOnInit(): void {
    this.load();
  }

  /**
   * Conecta el paginador y el ordenamiento a la tabla.
   * @summary Vincula MatPaginator y MatSort al dataSource.
   * @returns void
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Carga la lista de libros desde la API.
   * @summary Actualiza el dataSource de la tabla.
   * @returns void
   * @link /api/v1/books
   */
  protected load(): void {
    this.crud.getAll('/api/v1/books').subscribe((items: BookDto[]) => (this.dataSource.data = items));
  }

  /**
   * Abre el formulario para crear un nuevo libro.
   * @summary Muestra diálogo y recarga al cerrar si hubo guardado.
   * @returns void
   */
  protected create(): void {
    const ref = this.dialog.open(BookFormDialog, {
      data: { id: null },
      disableClose: true,
      width: '600px',
    });
    ref.afterClosed().subscribe((saved: boolean | undefined) => {
      if (saved) this.load();
    });
  }

  /**
   * Abre el formulario de edición de un libro existente.
   * @summary Carga el libro por id en el diálogo.
   * @param item Libro seleccionado.
   * @returns void
   */
  protected edit(item: BookDto): void {
    const ref = this.dialog.open(BookFormDialog, {
      data: { id: item.id },
      disableClose: true,
      width: '600px',
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.load();
    });
  }

  /**
   * Confirma y elimina un libro.
   * @summary Muestra confirmación y ejecuta DELETE si se acepta.
   * @param item Libro a eliminar.
   * @returns void
   * @link /api/v1/books/{id}
   */
  protected remove(item: BookDto): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Eliminar libro "${item.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.crud.softDelete('/api/v1/books', item.id).subscribe({
        next: () => {
          this.snack.open('Libro eliminado', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snack.open('Error al eliminar el libro', 'Cerrar', { duration: 4000 });
        },
      });
    });
  }
}

 
