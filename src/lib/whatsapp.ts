export function normalizeWhatsApp(input: string): string {
  const digits = (input || '').replace(/\D/g, '')
  const match = digits.match(/(?:1)?(\d{7,15})$/)
  return match ? match[1] : digits
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const base = phone.startsWith('http') ? phone.replace(/[&?]text=.*$/, '') : `https://wa.me/${normalizeWhatsApp(phone)}`
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}text=${encodeURIComponent(message)}`
}
