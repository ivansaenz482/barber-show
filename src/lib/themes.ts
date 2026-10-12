export type ThemeKey =
  | 'normal'
  | 'halloween'
  | 'navidad'
  | 'playera'
  | 'san-valentin'
  | 'dia-padre'
  | 'escolar'

export interface ThemeDef {
  key: ThemeKey
  label: string
  emoji: string
  description: string
  banner?: string
  swatch: [string, string, string]
}

export const THEMES: ThemeDef[] = [
  {
    key: 'normal',
    label: 'Edición normal',
    emoji: '✂️',
    description: 'El estilo clásico dorado de Exclusive.',
    swatch: ['#d4af37', '#f0d078', '#0a0a0a'],
  },
  {
    key: 'halloween',
    label: 'Halloween',
    emoji: '🎃',
    description: 'Naranja y morado con espíritu de Halloween.',
    banner: '🎃 Especial Halloween — ¡Ven disfrazado y gana puntos extra!',
    swatch: ['#ff7a18', '#b45cff', '#0d0a12'],
  },
  {
    key: 'navidad',
    label: 'Navidad',
    emoji: '🎄',
    description: 'Rojo y verde navideño con detalles dorados.',
    banner: '🎄 Especial Navidad — Regala el mejor corte esta temporada.',
    swatch: ['#e63946', '#2a9d8f', '#0a0f0d'],
  },
  {
    key: 'playera',
    label: 'Temporada playera',
    emoji: '🏖️',
    description: 'Azul turquesa y arena para el verano.',
    banner: '🏖️ Temporada playera — Luce un corte fresco para la playa.',
    swatch: ['#06b6d4', '#f59e0b', '#041a1f'],
  },
  {
    key: 'san-valentin',
    label: 'San Valentín',
    emoji: '❤️',
    description: 'Rosa y rojo romántico.',
    banner: '❤️ San Valentín — Ven en pareja y aprovecha el 2x1 en productos.',
    swatch: ['#e11d48', '#fb7185', '#1a070d'],
  },
  {
    key: 'dia-padre',
    label: 'Día del Padre',
    emoji: '🎩',
    description: 'Azul acero elegante para papá.',
    banner: '🎩 Día del Padre — El mejor regalo es un buen corte.',
    swatch: ['#3b82f6', '#f59e0b', '#0a1020'],
  },
  {
    key: 'escolar',
    label: 'Temporada escolar',
    emoji: '🎒',
    description: 'Azul y amarillo de regreso a clases.',
    banner: '🎒 Regreso a clases — Corte escolar con precio especial.',
    swatch: ['#2563eb', '#facc15', '#0a0f1a'],
  },
]

export function themeDef(key: ThemeKey | undefined): ThemeDef {
  return THEMES.find((t) => t.key === key) ?? THEMES[0]
}
