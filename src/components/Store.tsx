import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useData } from '../context/data-context'
import { useSettings } from '../context/settings-context'
import { buildWhatsAppLink } from '../lib/whatsapp'
import type { ProductCategory } from '../lib/types'

const categories: { key: ProductCategory | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'ropa', label: 'Ropa' },
  { key: 'perfume', label: 'Perfumes' },
  { key: 'accesorio', label: 'Accesorios' },
]

export default function Store() {
  const { products, cart, addToCart, removeFromCart, clearFromCart, cartCount, cartTotal, currentClient, placeOrder } =
    useData()
  const { settings } = useSettings()
  const [filter, setFilter] = useState<ProductCategory | 'todos'>('todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [ordered, setOrdered] = useState(false)

  const filtered = filter === 'todos' ? products : products.filter((p) => p.category === filter)

  const orderNow = async () => {
    const lines = products
      .filter((p) => cart[p.id])
      .map((p) => `• ${p.name} x${cart[p.id]} — $${(Number(p.price) * cart[p.id]).toFixed(2)}`)
    const header = currentClient ? `Hola, soy ${currentClient.name}.` : 'Hola Exclusive Barber Show!'
    const message = `${header} Quiero hacer este pedido:\n${lines.join('\n')}\n\nTotal: $${cartTotal.toFixed(2)}`
    window.open(buildWhatsAppLink(settings.whatsapp, message), '_blank')
    if (currentClient) {
      await placeOrder()
      setOrdered(true)
      setTimeout(() => setOrdered(false), 4000)
    }
  }

  return (
    <section id="tienda" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Tienda"
        title="Barber Shop Store"
        subtitle="Ropa, perfumes y accesorios con estilo Exclusive. Haz tu pedido por WhatsApp y te lo preparamos."
      />

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              filter === c.key
                ? 'bg-gradient-to-r from-primary to-accent text-background'
                : 'border border-primary/25 text-slate-300 hover:border-primary/60 hover:text-primary-light'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400">
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-light backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                  {p.description}
                </p>
                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="font-display text-xl font-extrabold text-gold">${p.price}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-bold text-background transition-transform hover:scale-105"
                  >
                    <Plus size={14} />
                    Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <a
          href="./store.html"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
        >
          Ver tienda completa
          <ArrowUpRight size={18} />
        </a>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles size={16} className="text-gold" />
          Envíos y pagos coordinados por WhatsApp.
        </div>
      </motion.div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            type="button"
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3.5 font-bold text-background shadow-2xl shadow-primary/30 transition-transform hover:scale-105"
          >
            <ShoppingBag size={18} />
            {cartCount}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-primary/20 bg-card"
            >
              <div className="flex items-center justify-between border-b border-primary/15 bg-surface px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary-light" />
                  <h2 className="font-display text-lg font-bold text-white">Tu pedido</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Cerrar carrito"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-primary/20 text-slate-300 transition-colors hover:bg-primary/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {Object.entries(cart).length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">Tu pedido está vacío.</p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {Object.entries(cart).map(([id, qty]) => {
                      const p = products.find((x) => x.id === id)
                      if (!p) return null
                      return (
                        <li
                          key={id}
                          className="flex items-center gap-4 rounded-xl border border-primary/15 bg-surface p-3"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-white">{p.name}</p>
                            <p className="text-sm font-semibold text-gold">
                              ${(Number(p.price) * qty).toFixed(2)}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => removeFromCart(id)}
                                aria-label="Quitar uno"
                                className="grid h-7 w-7 place-items-center rounded-lg border border-primary/25 text-primary-light hover:bg-primary/10"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-white">{qty}</span>
                              <button
                                type="button"
                                onClick={() => addToCart(id)}
                                aria-label="Agregar uno"
                                className="grid h-7 w-7 place-items-center rounded-lg border border-primary/25 text-primary-light hover:bg-primary/10"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => clearFromCart(id)}
                            aria-label="Eliminar"
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 size={15} />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="border-t border-primary/15 bg-surface px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Total</span>
                  <span className="font-display text-2xl font-extrabold text-gold">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={orderNow}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3.5 font-bold text-background transition-transform hover:scale-[1.02]"
                >
                  <Send size={18} />
                  Pedir por WhatsApp
                </button>
                {!currentClient && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Si no estás registrado, tu pedido se envía igual por WhatsApp.
                  </p>
                )}
                {ordered && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary-light"
                  >
                    Pedido registrado. ¡Gracias!
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
