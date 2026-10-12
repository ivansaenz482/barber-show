# Exclusive Barber Show — Barbería Premium

Sitio web profesional para una barbería (barber show) de marca **EXCLUSIVE**, con diseño **dark premium turquesa**, desplegado en **Vercel**.

![Tech](https://img.shields.io/badge/React-19-14b8a6) ![Tech](https://img.shields.io/badge/Vite-8-14b8a6) ![Tech](https://img.shields.io/badge/Tailwind-4-14b8a6) ![Tech](https://img.shields.io/badge/Framer_Motion-13-14b8a6) ![Tech](https://img.shields.io/badge/Firebase-12-14b8a6)

## Secciones

- **Inicio (Hero)** — portada con foto de la barbería, logo principal y llamados a la acción
- **Servicios** — cortes para adultos, jóvenes y niños
- **Carrusel** — galería automática con transiciones y controles
- **Galería** — filtros por categoría (La Barbería / Adultos / Jóvenes) y lightbox
- **Precios** — planes Clásico, Premium e Infantil
- **Promociones** — ofertas con imagen (gestionables desde el panel)
- **Citas** — reserva de cita en línea para clientes registrados (con hora y Happy Hour)
- **Mi cuenta (Club Exclusive)** — puntos, nivel (Bronce/Plata/Oro), carnet QR, premios canjeables y referidos
- **Tienda** — ropa, perfumes y accesorios con pedido por **WhatsApp** y página completa en pestaña nueva
- **Opiniones** — testimonios de clientes
- **Contacto** — formulario de reserva, horarios y datos
- **Footer** — navegación, servicios y redes

## Funciones premium (100% gratis)

| Función | Descripción |
| --- | --- |
| App instalable (PWA) | Instálala en Android e iOS desde el navegador; funciona como app nativa y con atajos |
| Registro por QR | El cliente escanea el código QR de la barbería y se registra en segundos (solo nombre y celular; Gmail, cédula y cumpleaños opcionales) |
| Puntos y premios | Cada corte suma puntos; el admin crea premios canjeables (corte gratis, descuentos, productos) |
| Niveles del cliente | Bronce, Plata y Oro según la cantidad de cortes, con beneficios |
| Carnet digital QR | El cliente muestra su carnet; el admin lo escanea desde el panel para identificarlo y sumarle puntos |
| Agenda día/semana | El admin ve las citas de hoy o de la semana y gestiona cada una (confirmar, completar, ausente) |
| Turnos manuales | El admin puede dar un turno a un cliente que no maneja la tecnología (registrado o nuevo) |
| Corte gratis de cumpleaños | El sistema detecta cumpleaños y activa el banner dorado "corte gratis". Requiere **constancia**: el admin verifica la cédula y registra la constancia (válida una vez al año) |
| Referidos | Cada cliente tiene un código; al invitar a un amigo, ambos ganan puntos |
| Calificaciones | El cliente califica con estrellas cada corte completado; el admin ve el promedio por barbero |
| Contabilidad | Ingresos (cortes y tienda), gastos por categoría y ganancia neta por mes, exportable a CSV |
| Comisión por barbero | % de comisión configurable y cálculo de cuánto pagarle a cada barbero |
| Ranking de barberos | Quién corta más, cuánto efectivo genera, su comisión y calificación promedio |
| Happy Hour | Descuento automático en días y horarios de poca demanda que el admin configura |
| Modos de temporada | El admin cambia el diseño completo con un botón: Halloween, Navidad, playera, San Valentín, Día del Padre, temporada escolar o edición normal. Incluye efectos animados ligeros (nieve en Navidad, murciélagos en Halloween que entran volando, corazones, etc.) con auto-pausa y respeto a "reducir movimiento" |
| Menú lateral | La navegación es un panel lateral oculto que se abre con una pestaña en el borde derecho, para no chocar con el banner de registro |
| Visitas y cortes | Cada visita y cada corte se registra para estadísticas |
| Panel de administración | Estadísticas, CRUD de servicios/productos/promociones/premios, clientes, pedidos, QR y ajustes |
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
| Vercel | — | Despliegue automático |

## Puesta en marcha local

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # compilar producción (carpeta dist/)
npm run lint       # revisar código
npm run preview    # previsualizar la build
```

## Desplegar en Vercel

La web está desplegada en Vercel y conectada al repositorio de GitHub: cada `git push` a `main` publica automáticamente.

- **URL de producción:** https://barber-show-iota.vercel.app
- Panel de control: https://vercel.com (proyecto `barber-show`)

Despliegue manual desde la terminal (opcional):

```bash
npm i -g vercel
vercel link --yes          # asociar el proyecto (solo la primera vez)
vercel --prod              # publicar en producción
```

La configuración de Vercel vive en `vercel.json` (framework Vite, build `npm run build`, salida `dist/`).

## Conectar Firebase (opcional, recomendado)

La web usa **Firebase Firestore** (proyecto `barber-show-6771f`), cuyo plan gratuito (Spark) soporta muchísimos más de **500 usuarios** (realmente decenas de miles): 1 GiB de almacenamiento, 50 000 lecturas y 20 000 escrituras gratis por día, sin tarjeta de crédito. No hace falta cambiar de base de datos para 500 clientes. Sin configurar nada, la web funciona en **modo demo** (localStorage). Para reconectar o cambiar de proyecto:

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

1. **Estadísticas** — visitas, cortes realizados, clientes, pedidos, **ingresos (cortes, tienda y total)**, **ranking de barberos** (cortes, efectivo, comisión y calificación), productos más vendidos, próximas citas y cumpleañeros de hoy.
2. **Agenda** — citas de **hoy / esta semana / todas**, con estados (pendiente, confirmada, completada, ausente) y botón **"Dar turno manual"** para clientes sin tecnología.
3. **Barberos** — nombre y **% de comisión** editable de cada barbero.
4. **Servicios** — agregar, editar y eliminar servicios con precio (alimenta la sección de citas).
5. **Productos** — agregar, **editar** y eliminar productos con foto (subida o URL), categoría (ropa/perfume/accesorio) y precio.
6. **Promociones** — ofertas con foto y descripción, también **editables**.
7. **Planes** — planes de precios con beneficios editables.
8. **Galería** — fotos editables con categoría y orden.
9. **Clientes** — registro con **puntos, nivel, cortes y ausencias**; buscador, **escáner de carnet QR** y botón **± Puntos** para ajustar manualmente.
10. **Premios** — CRUD de premios canjeables (nombre, descripción, costo en puntos, activo).
11. **Pedidos** — pedidos de la tienda recibidos.
12. **Contabilidad** — ingresos del mes, **gastos por categoría**, ganancia neta, **comisión por barbero** y **exportación a CSV**.
13. **QR de registro** — código QR listo para imprimir y colocar en la barbería.
14. **Temporada** — botones para cambiar el diseño completo de la página según la temporada (Halloween, Navidad, playera, San Valentín, Día del Padre, temporada escolar o edición normal).
15. **Ajustes** — celular, correo, dirección, WhatsApp, redes, horarios y **programa de fidelidad** (puntos, referidos y Happy Hour).

Para entrar: haz clic en **"Administrar página"** (enlace pequeño en el footer) e ingresa la contraseña. Por defecto es: `exclusive123`

Notas:
- La contraseña se cambia en `src/data/settings.ts` (constante `ADMIN_PASSWORD`).
- En modo demo los cambios se guardan en el navegador donde se editen. Al conectar Firebase, se guardan en la nube y aparecen para todos los visitantes.

## Notas

- Las imágenes del carrusel y la galería son fotos de muestra de Unsplash (URLs públicas). Reemplázalas en `src/data/images.ts` por las fotos reales de tu barbería.
- La paleta de colores se define en `src/index.css` dentro del bloque `@theme` (estilo barbería profesional: negro `#0a0a0a` con acentos dorados `#d4af37`).
- El QR del panel usa el servicio gratuito `api.qrserver.com`; apunta a la URL de tu sitio.
- Rendimiento: Firebase se carga de forma diferida (no bloquea el primer render) y las imágenes del carrusel/galería usan carga diferida. Para el logo, coloca la imagen en `public/logo.png` (se usa en el encabezado y en el pie); si no existe, se muestra el logo de tijeras por defecto. También se puede usar como icono de la app generando los PNG cuadrados en `public/icons/`.
- El registro del cliente pide solo **nombre y celular**; los datos extra (Gmail, cédula y cumpleaños) son opcionales y están en un desplegable, para que reservar sea lo más rápido posible.
- El cliente elige con cuál de los 3 barberos quiere cortarse al reservar; el panel registra cortes e ingresos por barbero.
