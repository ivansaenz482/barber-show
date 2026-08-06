export type Category = 'barberia' | 'cortes' | 'adultos' | 'jovenes'

export interface GalleryImage {
  id: string
  src: string
  title: string
  category: Category
}

export interface CarouselSlide {
  id: string
  src: string
  title: string
  description: string
}

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'slide-1',
    src: u('photo-1621605815971-fbc98d665033', 1600),
    title: 'Corte Fade',
    description: 'Degradado técnico y definido para un acabado de primera.',
  },
  {
    id: 'slide-2',
    src: u('photo-1567894340315-735d7c361db0', 1600),
    title: 'Fade Moderno',
    description: 'Transiciones limpias que marcan estilo y confianza.',
  },
  {
    id: 'slide-3',
    src: u('photo-1587909209111-5097ee578ec3', 1600),
    title: 'Corte Clásico',
    description: 'Precisión con tijera y maquinilla para un look impecable.',
  },
  {
    id: 'slide-4',
    src: u('photo-1560066984-138dadb4c035', 1600),
    title: 'Perfilado de Barba',
    description: 'Diseño y cuidado de barba con toalla caliente y productos premium.',
  },
  {
    id: 'slide-5',
    src: u('photo-1522202176988-66273c2fd55f', 1600),
    title: 'Nuestra Barbería',
    description: 'Un espacio premium diseñado para tu confianza y estilo.',
  },
]

export const galleryImages: GalleryImage[] = [
  {
    id: 'g1',
    src: u('photo-1605497788044-5a32c7078486', 900),
    title: 'Sillones y espejos',
    category: 'barberia',
  },
  {
    id: 'g2',
    src: u('photo-1517420704952-d9f39e95b43e', 900),
    title: 'Estación de trabajo',
    category: 'barberia',
  },
  {
    id: 'g3',
    src: u('photo-1580086319619-3ed498161c77', 900),
    title: 'Herramientas del oficio',
    category: 'barberia',
  },
  {
    id: 'g4',
    src: u('photo-1622286342621-4bd786c2447c', 900),
    title: 'Corte con maquinilla',
    category: 'cortes',
  },
  {
    id: 'g5',
    src: u('photo-1622287162716-f311baa1a2b8', 900),
    title: 'Degradado en proceso',
    category: 'cortes',
  },
  {
    id: 'g6',
    src: u('photo-1615529182904-14819c35db37', 900),
    title: 'Fade bajo',
    category: 'cortes',
  },
  {
    id: 'g7',
    src: u('photo-1605980776566-0486c3ac7617', 900),
    title: 'Detalle de tijera',
    category: 'cortes',
  },
  {
    id: 'g8',
    src: u('photo-1506794778202-cad84cf45f1d', 900),
    title: 'Estilo ejecutivo',
    category: 'adultos',
  },
  {
    id: 'g9',
    src: u('photo-1500648767791-00dcc994a43e', 900),
    title: 'Look clásico',
    category: 'adultos',
  },
  {
    id: 'g10',
    src: u('photo-1492562080023-ab3db95bfbce', 900),
    title: 'Caballero moderno',
    category: 'adultos',
  },
  {
    id: 'g11',
    src: u('photo-1515886657613-9f3515b0c78f', 900),
    title: 'Retrato masculino',
    category: 'adultos',
  },
  {
    id: 'g12',
    src: u('photo-1531427186611-ecfd6d936c79', 900),
    title: 'Estilo urbano',
    category: 'jovenes',
  },
  {
    id: 'g13',
    src: u('photo-1601524909162-ae8725290836', 900),
    title: 'Tendencia actual',
    category: 'jovenes',
  },
  {
    id: 'g14',
    src: u('photo-1583744946564-b52ac1c389c8', 900),
    title: 'Corte trendy',
    category: 'jovenes',
  },
  {
    id: 'g15',
    src: u('photo-1517836357463-d25dfeac3438', 900),
    title: 'Estilo despeinado',
    category: 'jovenes',
  },
]

export const heroBackground = u('photo-1621605815971-fbc98d665033', 2000)
