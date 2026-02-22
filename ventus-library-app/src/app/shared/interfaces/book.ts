/**
 * Representa un libro.
 * @summary DTO compartido para vistas y formularios.
 */
export interface BookDto {
  /**
   * Identificador único del libro.
   * @summary Clave primaria del registro.
   * @link /api/v1/books/{id}
   */
  id: number;
  /**
   * Título del libro.
   * @summary Campo principal editable y visible.
   */
  title: string;
  /**
   * Descripción o sinopsis del libro (opcional).
   * @summary Texto libre no obligatorio.
   */
  description?: string;
  /**
   * Año de publicación. Negativo indica AC (antes de Cristo).
   * @summary Se maneja conversión según interruptor AC.
   */
  publicationYear: number;
  /**
   * Cantidad de páginas del libro.
   * @summary Debe ser mayor que cero.
   */
  pageCount: number;
  /**
   * Identificador del autor asociado.
   * @summary Relación con AuthorDto.
   * @link /api/v1/authors/{id}
   */
  authorId: number;
  /**
   * Identificador del género asociado.
   * @summary Relación con GenreDto.
   * @link /api/v1/genres/{id}
   */
  genreId: number;
  /**
   * Estado de actividad del libro (opcional).
   * @summary Puede omitirse si el backend no lo provee.
   */
  active?: boolean;
  /**
   * Nombre del autor (opcional, para listados).
   * @summary Campo derivado usado en tablas.
   */
  authorName?: string;
  /**
   * Nombre del género (opcional, para listados).
   * @summary Campo derivado usado en tablas.
   */
  genreName?: string;
}
