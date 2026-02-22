# Ventus Library (Repositorio)

Este repositorio contiene la aplicación frontend (Angular) para la biblioteca Ventus y depende del backend Ventus Library API (.NET Core).

## Estructura
- `ventus-library-app/` → Proyecto Angular (frontend).

## Requisitos
- Node.js y npm
- Angular CLI
- Git

## Descarga
- Clona el repo o descarga el ZIP:
  - `git clone <URL_DEL_REPO>`
  - `cd ventus-libary-app`

## Instalación de paquetes (frontend)
- Entra al proyecto Angular:
  - `cd ventus-library-app`
- Instala dependencias:
  - `npm install`

## Ejecución (frontend)
- Servidor de desarrollo:
  - `ng serve -o`
- Abre `http://localhost:4200/`.

## Compilación (frontend)
- Construye para producción:
  - `ng build`
- Artefactos en `ventus-library-app/dist/`.

## Configurar la ruta del backend
- El frontend usa un proxy local para enrutar `/api` al backend.
- Edita `ventus-library-app/proxy.conf.json` y ajusta `"target"`:
  - Por defecto: `https://localhost:7041`
  - Si el certificado no es válido, deja `"secure": false`.
- El dev server toma este proxy automáticamente desde `ventus-library-app/angular.json`.

## Dependencia a Ventus Library API
- Backend esperado con endpoints versión `/api/v1`:
  - Libros (CRUD): `/api/v1/books`
  - Autores (CRUD): `/api/v1/authors`
  - Géneros (lista): `/api/v1/genres`
- Asegúrate de que el backend esté corriendo y que la URL coincida con el proxy.

## Convenciones del frontend
- Estilos globales:
  - Solo se utiliza `ventus-library-app/src/styles.css` con tema precompilado de Angular Material.
- Alias de imports:
  - Configurados en `ventus-library-app/tsconfig.json` y `tsconfig.app.json`:
    - `@ventus/core/*` → `src/app/core/*`
    - `@ventus/shared/*` → `src/app/shared/*`
  - ConfirmDialog: `@ventus/shared/confirm-dialog`.
- Interceptores HTTP:
  - Proveídos en `ventus-library-app/src/app/app.config.ts`.

## Scripts útiles (desde ventus-library-app)
- `npm start` → `ng serve`
- `npm run build` → `ng build`
- `npm run test` → `ng test`
- `npm run lint` → `ng lint`

## Buenas prácticas
- No subir `.env` ni secretos (ya ignorados en `.gitignore`).
- Ejecutar `npm audit` y considerar `npm audit fix` antes de publicar.

## Publicación en Git
- Inicializa git en la raíz si aún no existe:
  - `git init`
  - `git add .`
  - `git commit -m "feat: inicialización Ventus Library"`
  - `git branch -M main`
  - `git remote add origin <URL_DEL_REPO>`
  - `git push -u origin main`
