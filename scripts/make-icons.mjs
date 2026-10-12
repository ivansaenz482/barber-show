import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(size, pixelFn) {
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y, size)
      const o = y * (size * 4 + 1) + 1 + x * 4
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
      raw[o + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const GOLD = [212, 175, 55]
const TEAL = [20, 184, 166]
const WHITE = [245, 245, 245]
const DARK = [10, 10, 10]

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.max(x0 + r, Math.min(x, x1 - r))
  const cy = Math.max(y0 + r, Math.min(y, y1 - r))
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= r * r || (x >= x0 + r && x <= x1 - r) || (y >= y0 + r && y <= y1 - r)
}

function iconPixel(x, y, S) {
  const px = x / S
  const py = y / S
  if (!inRoundedRect(px, py, 0, 0, 1, 1, 0.18)) return [0, 0, 0, 0]
  let color = DARK
  const poleX0 = 0.38
  const poleX1 = 0.62
  const poleY0 = 0.2
  const poleY1 = 0.8
  const capH = 0.055
  const inCapTop = px >= poleX0 - 0.04 && px <= poleX1 + 0.04 && py >= poleY0 - capH && py <= poleY0
  const inCapBot = px >= poleX0 - 0.04 && px <= poleX1 + 0.04 && py >= poleY1 && py <= poleY1 + capH
  if (inCapTop || inCapBot) {
    color = GOLD
  } else if (inRoundedRect(px, py, poleX0, poleY0, poleX1, poleY1, 0.09)) {
    const t = (px * 1.6 + py * 2.6) % 0.36
    color = t < 0.12 ? TEAL : t < 0.24 ? WHITE : GOLD
    const edge = Math.min(px - poleX0, poleX1 - px)
    if (edge < 0.015) color = [40, 40, 40]
  } else {
    const d = Math.hypot(px - 0.5, py - 0.5)
    if (d > 0.46) color = [16, 16, 16]
  }
  return [...color, 255]
}

function solidPixel(x, y, S) {
  const [r, g, b, a] = iconPixel(x, y, S)
  return a === 0 ? [...DARK, 255] : [r, g, b, 255]
}

const targets = [
  ['icon-192.png', 192, iconPixel],
  ['icon-512.png', 512, iconPixel],
  ['maskable-512.png', 512, iconPixel],
  ['apple-touch-icon.png', 180, solidPixel],
]

for (const [name, size, fn] of targets) {
  writeFileSync(join(outDir, name), encodePng(size, fn))
  console.log('OK', name, size)
}
