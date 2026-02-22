import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService<T> {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene una colección de entidades desde un recurso HTTP.
   * @summary Operación de lectura para una lista paginable/filtrable.
   * @template T Tipo de la entidad (por ejemplo, {@link BookDto}, {@link AuthorDto}, {@link GenreDto}).
   * @param resourceUrl URL del recurso (ej. /api/v1/books).
   * @param params Parámetros de consulta opcionales (paginación, filtros).
   * @returns Observable con arreglo de entidades T.
   * @link /api/v1/books
   * @link /api/v1/authors
   * @link /api/v1/genres
   */
  getAll(resourceUrl: string, params?: Record<string, string | number>): Observable<T[]> {
    const httpParams =
      params &&
      new HttpParams({
        fromObject: Object.entries(params).reduce<Record<string, string>>(
          (acc, [k, v]) => {
            acc[k] = String(v);
            return acc;
          },
          {}
        ),
      });
    return this.http.get<T[]>(resourceUrl, { params: httpParams });
  }

  /**
   * Obtiene una entidad por su identificador.
   * @summary Devuelve null si el servicio responde 204 No Content.
   * @template T Tipo de la entidad.
   * @param resourceUrl URL del recurso (ej. /api/v1/books).
   * @param id Identificador de la entidad.
   * @returns Observable con la entidad T o null.
   * @link /api/v1/books/{id}
   */
  getById(resourceUrl: string, id: number): Observable<T | null> {
    return this.http
      .get<T>(`${resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<T>) => (res.status === 204 ? null : res.body ?? null)));
  }

  /**
   * Crea una entidad en el recurso indicado.
   * @summary POST con el cuerpo parcial de T.
   * @template T Tipo de la entidad.
   * @param resourceUrl URL del recurso (ej. /api/v1/authors).
   * @param payload Datos a crear (parciales).
   * @returns Observable con la entidad creada T.
   * @link /api/v1/authors
   */
  create(resourceUrl: string, payload: Partial<T>): Observable<T> {
    return this.http.post<T>(resourceUrl, payload);
  }

  /**
   * Actualiza una entidad existente por id.
   * @summary PUT con el cuerpo parcial de T.
   * @template T Tipo de la entidad.
   * @param resourceUrl URL del recurso (ej. /api/v1/books).
   * @param id Identificador de la entidad a actualizar.
   * @param payload Datos a actualizar (parciales).
   * @returns Observable con la entidad actualizada T.
   * @link /api/v1/books/{id}
   */
  update(resourceUrl: string, id: number, payload: Partial<T>): Observable<T> {
    return this.http.put<T>(`${resourceUrl}/${id}`, payload);
  }

  /**
   * Elimina (lógica o física según backend) una entidad por id.
   * @summary DELETE a la ruta del recurso con id.
   * @template T Tipo de la entidad.
   * @param resourceUrl URL del recurso (ej. /api/v1/authors).
   * @param id Identificador de la entidad a eliminar.
   * @returns Observable vacío cuando la operación completa.
   * @link /api/v1/authors/{id}
   */
  softDelete(resourceUrl: string, id: number): Observable<void> {
    return this.http.delete<void>(`${resourceUrl}/${id}`);
  }
}
