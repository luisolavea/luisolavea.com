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
- `src/assets/posts/`: imágenes heroImage de los posts.

### Frontmatter soportado

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `title` | Sí | Título del post |
| `description` | Sí | Descripción para SEO/previews |
| `pubDate` | Sí | Fecha de publicación (ISO 8601) |
| `updatedDate` | No | Fecha de actualización |
| `heroImage` | Sí* | Ruta relativa a la imagen destacada (ver nota abajo) |
| `category` | No | Categoría (`vida`, `tecnologia`, `videos`, `general`) |
| `tags` | No | Array de etiquetas |

> **Nota sobre `heroImage`:**
> - Posts de **blog** (`category: vida`, `tecnologia`, etc.): requieren `heroImage` con ruta relativa: `../../assets/posts/{slug}.jpg`
> - Posts de **videos** (`category: videos`): **NO llevan `heroImage`**. El thumbnail se obtiene automáticamente desde YouTube.

### Convenciones de imagen

- Formato: JPG (recomendado para fotos)
- Ubicación: `src/assets/posts/{slug-del-post}.jpg`
- Tamaño recomendado: 1200x630px (ratio 1.91:1 para Open Graph)
- Ruta en frontmatter: `../../assets/posts/{slug}.jpg` (ruta relativa desde `src/content/blog/`)

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
