/**
 * Representa un autor.
 * @summary DTO compartido para vistas y formularios.
 */
export interface AuthorDto {
  /**
   * Identificador único del autor.
   * @summary Clave primaria del registro.
   * @link /api/v1/authors/{id}
   */
  id: number;
  /**
   * Nombre completo del autor.
   * @summary Campo visible en listados y selects.
   */
  fullName: string;
  /**
   * Descripción o biografía del autor (opcional).
   * @summary Texto libre no obligatorio.
   */
  description?: string;
  /**
   * Fecha de nacimiento del autor (opcional).
   * @summary Formato libre provisto por backend.
   */
  birthDate?: string;
  /**
   * Ciudad de residencia del autor (opcional).
   * @summary Texto corto.
   */
  city?: string;
  /**
   * Correo electrónico del autor (opcional).
   * @summary Puede no estar presente.
   */
  email?: string;
}
