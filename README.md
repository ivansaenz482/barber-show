# Barber Show — Barbería Premium

Sitio web profesional para una barbería (barber show), con diseño **dark premium turquesa**, listo para verse en cualquier parte del mundo mediante **GitHub Pages**.

![Tech](https://img.shields.io/badge/React-19-14b8a6) ![Tech](https://img.shields.io/badge/Vite-8-14b8a6) ![Tech](https://img.shields.io/badge/Tailwind-4-14b8a6) ![Tech](https://img.shields.io/badge/Framer_Motion-13-14b8a6)

## Secciones

- **Inicio (Hero)** — portada con poste de barbero animado y fondo en movimiento
- **Servicios** — cortes para adultos, jóvenes y niños
- **Carrusel** — galería automática con transiciones y controles
- **Galería** — filtros por categoría (La Barbería / Adultos / Jóvenes) y lightbox
- **Precios** — planes Clásico, Premium e Infantil
- **Opiniones** — testimonios de clientes
- **Contacto** — formulario de reserva, horarios y datos
- **Footer** — navegación, servicios y redes

## Tecnologías

| Herramienta | Versión | Uso |
| --- | --- | --- |
| TypeScript | 6 | Lenguaje |
| React | 19 | Framework UI |
| Vite | 8 | Compilador y dev server |
| Tailwind CSS | 4 | Estilos y diseño |
| Framer Motion | 13 | Animaciones |
| Lucide React | 1 | Iconos |
| @tailwindcss/vite | 4 | Plugin Tailwind para Vite |
| oxlint | 1 | Revisión de código |
| GitHub Actions | — | Despliegue automático |

## Puesta en marcha local

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # compilar producción (carpeta dist/)
npm run lint       # revisar código
npm run preview    # previsualizar la build
```

## Desplegar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `barber-show`) y sube este proyecto.

```bash
git init
git add .
git commit -m "Barber Show: sitio web de barbería premium"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/barber-show.git
git push -u origin main
```

2. En GitHub, entra a **Settings → Pages** y en "Source" elige **GitHub Actions** (no branch). Esto es necesario solo la primera vez.

3. Sube cualquier cambio a `main` (o pulsa *Run workflow* en la pestaña **Actions**) y GitHub Actions compilará y publicará automáticamente en:

```
https://TU_USUARIO.github.io/barber-show/
```

## Notas

- Las imágenes del carrusel y la galería son fotos de muestra de Unsplash (URLs públicas). Reemplázalas en `src/data/images.ts` por las fotos reales de tu barbería.
- Personaliza nombre, teléfono, dirección y correo en `src/components/Contact.tsx` y `src/components/Footer.tsx`.
- Los precios y servicios se editan en `src/components/Pricing.tsx` y `src/components/Services.tsx`.
- La paleta de colores se define en `src/index.css` dentro del bloque `@theme` (turquesa `#14b8a6`, fondo `#02120f`, acento dorado `#f0c26b`).
