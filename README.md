# luisolavea.com

Migración del blog personal a Astro.

## Decisiones del MVP

- URLs de posts en raíz: `/{slug}/` (sin `/post/`).
- Páginas por categoría: `/category/{slug}/`.
- Tags: solo nube visual, sin páginas por tag.
- Dark mode: post-lanzamiento.
- Sin `_redirects` para posts (URLs se preservan).

## Scripts

```bash
pnpm dev      # servidor de desarrollo
pnpm build    # build estático
pnpm preview  # previsualizar build
```

## Estructura de contenido

- `src/content/blog/`: posts en Markdown/MDX.
- Frontmatter soportado:
  - `title`
  - `description`
  - `pubDate`
  - `updatedDate` (opcional)
  - `heroImage` (opcional)
  - `category` (default: `general`)
  - `tags` (default: `[]`)

## Nota técnica

Astro 7.1.3 tiene un problema de compatibilidad con la versión de `cookie` resuelta por pnpm. El build falla porque Astro importa named exports de `cookie`, pero la versión resuelta solo ofrece CommonJS.

Solución aplicada:

1. **Override de dependencia** en `pnpm-workspace.yaml`:
   ```yaml
   overrides:
     cookie: 1.0.2
   ```
2. **Patch de Astro** en `patches/astro.patch`:
   Cambia `import { parseCookie, stringifySetCookie } from "cookie";` a importación default en `dist/core/cookies/cookies.js`.

Después de un `pnpm install` limpio, el patch se aplica automáticamente. Si se actualiza Astro, revisar si el patch sigue siendo necesario.
