import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CrudService } from '@ventus/core/services/crud';
import { AuthorDto } from '@ventus/shared/interfaces';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '@ventus/shared/confirm-dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthorFormDialog } from '../author-form-dialog/author-form-dialog';

@Component({
  selector: 'app-authors-list-page',
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
  templateUrl: './authors-list-page.html',
  styleUrl: './authors-list-page.css',
})
export class AuthorsListPage implements OnInit, AfterViewInit {
  private readonly crud = inject<CrudService<AuthorDto>>(CrudService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected displayedColumns = ['id', 'fullName', 'email', 'actions'];
  protected dataSource = new MatTableDataSource<AuthorDto>([]);
  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  /**
   * Inicializa el componente y carga los autores.
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
   * Carga la lista de autores desde la API.
   * @summary Actualiza el dataSource de la tabla.
   * @returns void
   * @link /api/v1/authors
   */
  protected load(): void {
    this.crud.getAll('/api/v1/authors').subscribe((items: AuthorDto[]) => (this.dataSource.data = items));
  }

  /**
   * Abre el formulario para crear un nuevo autor.
   * @summary Muestra diálogo y recarga al cerrar si hubo guardado.
   * @returns void
   */
  protected create(): void {
    const ref = this.dialog.open(AuthorFormDialog, {
      data: { id: null },
      disableClose: true,
      width: '600px',
    });
    ref.afterClosed().subscribe((saved: boolean | undefined) => {
      if (saved) this.load();
    });
  }

  /**
   * Abre el formulario de edición de un autor existente.
   * @summary Carga el autor por id en el diálogo.
   * @param item Autor seleccionado.
   * @returns void
   */
  protected edit(item: AuthorDto): void {
    const ref = this.dialog.open(AuthorFormDialog, {
      data: { id: item.id },
      disableClose: true,
      width: '600px',
    });
    ref.afterClosed().subscribe((saved: boolean | undefined) => {
      if (saved) this.load();
    });
  }

  /**
   * Confirma y elimina un autor.
   * @summary Muestra confirmación y ejecuta DELETE si se acepta.
   * @param item Autor a eliminar.
   * @returns void
   * @link /api/v1/authors/{id}
   */
  protected remove(item: AuthorDto): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Eliminar autor "${item.fullName}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.crud.softDelete('/api/v1/authors', item.id).subscribe({
        next: () => {
          this.snack.open('Autor eliminado', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snack.open('Error al eliminar el autor', 'Cerrar', { duration: 4000 });
        },
      });
    });
  }
}

 
