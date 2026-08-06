# Exclusive Barber Show — Barbería Premium

Sitio web profesional para una barbería (barber show) de marca **EXCLUSIVE**, con diseño **dark premium turquesa**, listo para verse en cualquier parte del mundo mediante **GitHub Pages**.

![Tech](https://img.shields.io/badge/React-19-14b8a6) ![Tech](https://img.shields.io/badge/Vite-8-14b8a6) ![Tech](https://img.shields.io/badge/Tailwind-4-14b8a6) ![Tech](https://img.shields.io/badge/Framer_Motion-13-14b8a6) ![Tech](https://img.shields.io/badge/Firebase-12-14b8a6)

## Secciones

- **Inicio (Hero)** — portada con poste de barbero animado y fondo en movimiento
- **Servicios** — cortes para adultos, jóvenes y niños
- **Carrusel** — galería automática con transiciones y controles
- **Galería** — filtros por categoría (La Barbería / Adultos / Jóvenes) y lightbox
- **Precios** — planes Clásico, Premium e Infantil
- **Promociones** — ofertas con imagen (gestionables desde el panel)
- **Citas** — reserva de cita en línea para clientes registrados
- **Tienda** — ropa, perfumes y accesorios con pedido por **WhatsApp** y página completa en pestaña nueva
- **Opiniones** — testimonios de clientes
- **Contacto** — formulario de reserva, horarios y datos
- **Footer** — navegación, servicios y redes

## Funciones premium (100% gratis)

| Función | Descripción |
| --- | --- |
| Registro por QR | El cliente escanea el código QR de la barbería y se registra (nombre, celular, gmail opcional, cédula, fecha de nacimiento) |
| Corte gratis de cumpleaños | El sistema detecta cumpleaños y activa el banner dorado "corte gratis" |
| Visitas y cortes | Cada visita y cada corte se registra para estadísticas |
| Panel de administración | Estadísticas, CRUD de servicios/productos/promociones, clientes, pedidos, QR y ajustes |
| Mejores vendidos | El panel calcula los productos más vendidos desde los pedidos |
| Tienda con carrito | Carrito flotante y pedido enviado por WhatsApp (sin comisiones ni tarjetas) |
| Modo demo | Sin configurar Firebase, la web funciona en modo local (localStorage) |

## Tecnologías

| Herramienta | Versión | Uso |
| --- | --- | --- |
| TypeScript | 6 | Lenguaje |
| React | 19 | Framework UI |
| Vite | 8 | Compilador y dev server |
| Tailwind CSS | 4 | Estilos y diseño |
| Framer Motion | 13 | Animaciones |
| Lucide React | 1 | Iconos |
| Firebase | 12 | Backend gratuito (Firestore + Auth + Storage) |
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

## Conectar Firebase (opcional, recomendado)

La web funciona en **modo demo** (localStorage) sin configurar nada. Para que los datos (clientes, citas, pedidos, estadísticas) se compartan entre todos los dispositivos, conecta Firebase — es gratis y no pide tarjeta:

1. Entra en https://console.firebase.google.com y crea un proyecto (nombre: `barber-show`).
2. Ve a **Compilación → Firestore Database → Crear base de datos** → elige "Modo de prueba" (se puede endurecer después) y una región cercana.
3. En **Descripción general del proyecto → Configuración → Tus apps → Web** (icono `</>`), registra una app y copia los 6 valores `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`.
4. Abre `src/lib/firebase-config.ts` y reemplaza los valores `PON_TU_API_KEY_AQUI` / `TU_PROYECTO` por los reales.
5. Guarda y sube:

```bash
git add .
git commit -m "Conectar Firebase"
git push
```

Tras el despliegue, el panel mostrará **"Conectado a Firebase"** y los datos quedarán sincronizados en la nube.

> Nota: la configuración de Firebase es pública por diseño (es un proyecto de cliente). La seguridad real se controla con las reglas de Firestore en la consola.

## Administrador de la página

La web incluye un **panel de administración** completo con pestañas:

1. **Estadísticas** — visitas, cortes realizados, clientes, pedidos, **ingresos (cortes, tienda y total)**, **rendimiento por barbero**, productos más vendidos, próximas citas y cumpleañeros de hoy.
2. **Barberos** — 3 barberos por defecto (Barbero 1, 2 y 3) con nombre editable. Solo el administrador puede agregar más.
3. **Servicios** — agregar, editar y eliminar servicios con precio (alimenta la sección de citas).
4. **Productos** — agregar, **editar** y eliminar productos con foto (subida o URL), categoría (ropa/perfume/accesorio) y precio.
5. **Promociones** — ofertas con foto y descripción, también **editables**.
6. **Clientes** — registro de clientes con datos completos. El cliente puede corregir sus propios datos desde "Mi cuenta".
7. **Pedidos** — pedidos de la tienda recibidos.
8. **QR de registro** — código QR listo para imprimir y colocar en la barbería.
9. **Ajustes** — celular, correo, dirección, WhatsApp, redes sociales y horarios.

Para entrar: haz clic en **"Administrar página"** (enlace pequeño en el footer) e ingresa la contraseña. Por defecto es: `exclusive123`

Notas:
- La contraseña se cambia en `src/data/settings.ts` (constante `ADMIN_PASSWORD`).
- En modo demo los cambios se guardan en el navegador donde se editen. Al conectar Firebase, se guardan en la nube y aparecen para todos los visitantes.

## Notas

- Las imágenes del carrusel y la galería son fotos de muestra de Unsplash (URLs públicas). Reemplázalas en `src/data/images.ts` por las fotos reales de tu barbería.
- La paleta de colores se define en `src/index.css` dentro del bloque `@theme` (estilo barbería profesional: negro `#0a0a0a` con acentos dorados `#d4af37`).
- El QR del panel usa el servicio gratuito `api.qrserver.com`; apunta a la URL de tu sitio.
- El cliente elige con cuál de los 3 barberos quiere cortarse al reservar; el panel registra cortes e ingresos por barbero.
