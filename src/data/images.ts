export type Category = 'barberia' | 'adultos' | 'jovenes'

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
    src: u('photo-1622286342621-4bd786c2447c', 1600),
    title: 'Corte Clásico',
    description: 'Precisión con tijera y maquinilla para un acabado impecable.',
  },
  {
    id: 'slide-2',
    src: u('photo-1599351431202-1e0f0137899a', 1600),
    title: 'Perfilado de Barba',
    description: 'Diseño y cuidado de barba con toalla caliente y productos premium.',
  },
  {
    id: 'slide-3',
    src: u('photo-1585747860715-2ba37e788b70', 1600),
    title: 'Nuestra Barbería',
    description: 'Un espacio premium diseñado para tu confianza y estilo.',
  },
  {
    id: 'slide-4',
    src: u('photo-1621605815971-fbc98d665033', 1600),
    title: 'Estilo Premium',
    description: 'Rituales de barbería que combinan tradición y modernidad.',
  },
  {
    id: 'slide-5',
    src: u('photo-1519345182560-3f2917c472ef', 1600),
    title: 'Fade Moderno',
    description: 'Degradados técnicos y tendencias para los que marcan estilo.',
  },
]

export const galleryImages: GalleryImage[] = [
  {
    id: 'g1',
    src: u('photo-1512690459411-b9245aed614b', 900),
    title: 'Sillones y maquinillas',
    category: 'barberia',
  },
  {
    id: 'g2',
    src: u('photo-1585747860715-2ba37e788b70', 900),
    title: 'Atmósfera barbería',
    category: 'barberia',
  },
  {
    id: 'g3',
    src: u('photo-1531891437562-4301cf35b7e4', 900),
    title: 'Espacio premium',
    category: 'barberia',
  },
  {
    id: 'g4',
    src: u('photo-1621605815971-fbc98d665033', 900),
    title: 'Estación de trabajo',
    category: 'barberia',
  },
  {
    id: 'g5',
    src: u('photo-1605497788044-5a32c7078486', 900),
    title: 'Nuestra casa',
    category: 'barberia',
  },
  {
    id: 'g6',
    src: u('photo-1519085360753-af0119f7cbe7', 900),
    title: 'Estilo clásico',
    category: 'adultos',
  },
  {
    id: 'g7',
    src: u('photo-1595152772835-219674b2a8a6', 900),
    title: 'Look ejecutivo',
    category: 'adultos',
  },
  {
    id: 'g8',
    src: u('photo-1580489944761-15a19d654956', 900),
    title: 'Corte y barba',
    category: 'adultos',
  },
  {
    id: 'g9',
    src: u('photo-1521572163474-6864f9cf17ab', 900),
    title: 'Corte casual',
    category: 'adultos',
  },
  {
    id: 'g10',
    src: u('photo-1507003211169-0a1dd7228f2d', 900),
    title: 'Retrato masculino',
    category: 'adultos',
  },
  {
    id: 'g11',
    src: u('photo-1622286342621-4bd786c2447c', 900),
    title: 'Trabajo de maquinilla',
    category: 'jovenes',
  },
  {
    id: 'g12',
    src: u('photo-1618077360395-f3068be8e001', 900),
    title: 'Estilo urbano',
    category: 'jovenes',
  },
  {
    id: 'g13',
    src: u('photo-1520975954732-35dd22299614', 900),
    title: 'Tendencia actual',
    category: 'jovenes',
  },
  {
    id: 'g14',
    src: u('photo-1519345182560-3f2917c472ef', 900),
    title: 'Fade en proceso',
    category: 'jovenes',
  },
  {
    id: 'g15',
    src: u('photo-1599351431202-1e0f0137899a', 900),
    title: 'Detalle de barba',
    category: 'jovenes',
  },
  {
    id: 'g16',
    src: u('photo-1622296089863-eb7fc530daa8', 900),
    title: 'Momentos en la silla',
    category: 'jovenes',
  },
]
