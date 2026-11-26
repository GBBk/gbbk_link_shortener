# GBBK Link Shortener

Acortador de links con códigos QR y estadísticas de cada click (ubicación y tipo de dispositivo). Cada usuario tiene su propio panel para crear, buscar y borrar links.

**Demo:** _próximamente_

<!-- Agregá acá una captura del dashboard: ![Dashboard](docs/dashboard.png) -->

## Funcionalidades

- Registro e inicio de sesión con Supabase Auth (con foto de perfil en Supabase Storage).
- Links cortos con código aleatorio o alias personalizado, validado y único.
- Código QR generado en el navegador y guardado en Storage, listo para descargar.
- Redirección que registra ciudad, país y dispositivo de cada visita, y redirige igual aunque falle la geolocalización.
- Estadísticas por link con gráficos de Recharts (top 5 ciudades y reparto por dispositivo).
- Datos protegidos con Row Level Security: cada usuario solo ve y modifica sus links y estadísticas.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| UI | Tailwind CSS 4, shadcn/ui (Radix), lucide-react, Recharts |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| Calidad | ESLint, Vitest, GitHub Actions |

## Cómo funciona

1. Al crear un link se valida el formulario con Yup, se genera el QR en un `<canvas>` y se sube a Storage.
2. Se guarda el link en la tabla `urls` con un código de 6 caracteres generado con `crypto.getRandomValues`, verificando que no exista.
3. Cuando alguien visita `/:codigo`, la app busca el link, registra el click en `clicks` y redirige al destino.

El esquema completo con las políticas RLS está en [`supabase/schema.sql`](supabase/schema.sql).

## Correrlo localmente

Requisitos: Node 20 o superior y un proyecto de Supabase.

```bash
git clone https://github.com/GBBk/gbbk_link_shortener.git
cd gbbk_link_shortener
npm install
cp .env.example .env   # completar con la URL y la clave pública de Supabase
npm run dev
```

En Supabase, ejecutá `supabase/schema.sql` en el SQL Editor y creá los buckets públicos `qrs` y `profile_pic`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Chequeo de tipos y build de producción |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios con Vitest |

## Deploy

Incluye `vercel.json` para que las rutas como `/:codigo` funcionen al recargar. En Vercel, importá el repo y cargá las dos variables de `.env.example`.

## Próximas mejoras

- Redirección del lado del servidor (Edge Function) para no cargar la app antes de redirigir.
- Vencimiento y contraseña opcionales por link.
- Exportar estadísticas a CSV.
