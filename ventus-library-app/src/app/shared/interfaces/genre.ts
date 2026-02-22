/**
 * Representa un género literario.
 * @summary DTO compartido para vistas y formularios.
 */
export interface GenreDto {
  /**
   * Identificador único del género.
   * @summary Clave primaria del registro.
   * @link /api/v1/genres/{id}
   */
  id: number;
  /**
   * Nombre del género literario.
   * @summary Texto corto.
   */
  name: string;
}
