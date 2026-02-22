# Ventus Library App (Frontend)

Aplicación frontend en Angular para la gestión de libros y autores. Depende de la API Ventus Library (backend en .NET Core) y usa Angular Material para la UI.

## Requisitos
- Node.js y npm (se recomienda npm 11.x)
- Angular CLI (21.1.x)
- Git

## Descarga del proyecto
- Clona este repositorio o descarga el ZIP:
  - `git clone <URL_DEL_REPOSITORIO>`
  - `cd ventus-library-app`

## Instalación de paquetes
- Instala dependencias:
  - `npm install`

## Ejecución en desarrollo
- Arranca el servidor:
  - `ng serve -o`
- App disponible en `http://localhost:4200/`.
- El proxy hacia el backend ya está configurado.

## Compilación para producción
- Genera artefactos en `dist/`:
  - `ng build`

## Cambiar la ruta del backend
- El frontend utiliza un proxy local para enrutar las llamadas `http` al backend:
  - Archivo: [proxy.conf.json](file:///C:/dev/ventus-libary-app/ventus-library-app/proxy.conf.json)
  - Clave `target`: ajusta la URL del backend (por defecto `https://localhost:7041`).
  - Si tu backend usa certificados no válidos, deja `"secure": false`.
- El dev server toma automáticamente este proxy desde [angular.json](file:///C:/dev/ventus-libary-app/ventus-library-app/angular.json#L82-L88).

## Dependencia a la API Ventus Library
- Backend recomendado: repositorio Ventus Library WebApi (.NET Core) con versionado por URL `/api/v1`.
- Endpoints esperados:
  - Libros (CRUD): `/api/v1/books`
  - Autores (CRUD): `/api/v1/authors`
  - Géneros (lista): `/api/v1/genres`
- Asegúrate de que el backend esté corriendo antes de usar el frontend y que coincida la URL configurada en el proxy.

## Estructura y convenciones
- Estilos globales:
  - Solo se utiliza [styles.css](file:///C:/dev/ventus-libary-app/ventus-library-app/src/styles.css) con tema precompilado de Angular Material (`indigo-pink`).
- Alias de imports (TypeScript):
  - Configurados en [tsconfig.json](file:///C:/dev/ventus-libary-app/ventus-library-app/tsconfig.json) y [tsconfig.app.json](file:///C:/dev/ventus-libary-app/ventus-library-app/tsconfig.app.json):
    - `@ventus/core/*` → `src/app/core/*`
    - `@ventus/shared/*` → `src/app/shared/*`
  - ConfirmDialog: `@ventus/shared/confirm-dialog`.
- Interceptores HTTP:
  - Proveídos en [app.config.ts](file:///C:/dev/ventus-libary-app/ventus-library-app/src/app/app.config.ts).

## Scripts útiles
- `npm start` → `ng serve`
- `npm run build` → `ng build`
- `npm run watch` → compilación en modo watch
- `npm run test` → pruebas unitarias (`ng test`)
- `npm run lint` → `ng lint`

## Buenas prácticas
- No subir `.env` ni secretos al repositorio (`.env` está ignorado en `.gitignore`).
- Si ves warnings por `*ngIf`/`*ngFor`, es por el compilador moderno; opcionalmente migrar a `@if`/`@for` más adelante.
