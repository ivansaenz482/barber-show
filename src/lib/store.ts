import { getCloud, isCloudConnected } from './firebase'

type Doc = Record<string, unknown>

const LS_PREFIX = 'exclusive_data_'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function lsRead(coll: string): Doc[] {
  try {
    const raw = localStorage.getItem(LS_PREFIX + coll)
    return raw ? (JSON.parse(raw) as Doc[]) : []
  } catch {
    return []
  }
}

function lsWrite(coll: string, data: Doc[]) {
  localStorage.setItem(LS_PREFIX + coll, JSON.stringify(data))
  notifyLocal(coll)
}

const localListeners = new Map<string, Set<() => void>>()

function notifyLocal(coll: string) {
  localListeners.get(coll)?.forEach((fn) => fn())
}

function addLocalListener(coll: string, fn: () => void): () => void {
  const set = localListeners.get(coll) ?? new Set<() => void>()
  set.add(fn)
  localListeners.set(coll, set)
  const onStorage = () => fn()
  window.addEventListener('storage', onStorage)
  return () => {
    set.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export const store = {
  isCloud: () => isCloudConnected(),

  async list<T>(coll: string): Promise<T[]> {
    const cloud = await getCloud()
    if (cloud) {
      const snap = await cloud.sdk.getDocs(cloud.sdk.collection(cloud.db, coll))
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as T[]
    }
    return lsRead(coll) as unknown as T[]
  },

  async add(coll: string, data: Record<string, unknown>): Promise<string> {
    const cloud = await getCloud()
    if (cloud) {
      const res = await cloud.sdk.addDoc(cloud.sdk.collection(cloud.db, coll), data)
      return res.id
    }
    const list = lsRead(coll)
    const id = uid()
    list.push({ id, ...data })
    lsWrite(coll, list)
    return id
  },

  async update(coll: string, id: string, patch: Record<string, unknown>) {
    const cloud = await getCloud()
    if (cloud) {
      await cloud.sdk.updateDoc(cloud.sdk.doc(cloud.db, coll, id), patch)
      return
    }
    const list = lsRead(coll)
    const idx = list.findIndex((d) => d.id === id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch }
      lsWrite(coll, list)
    }
  },

  async remove(coll: string, id: string) {
    const cloud = await getCloud()
    if (cloud) {
      await cloud.sdk.deleteDoc(cloud.sdk.doc(cloud.db, coll, id))
      return
    }
    const list = lsRead(coll).filter((d) => d.id !== id)
    lsWrite(coll, list)
  },

  subscribe<T>(coll: string, onChange: (items: T[]) => void): () => void {
    let unsub: (() => void) | null = null
    let cancelled = false

    const startLocal = () => {
      const emit = () => onChange(lsRead(coll) as unknown as T[])
      emit()
      unsub = addLocalListener(coll, emit)
    }

    if (!isCloudConnected()) {
      startLocal()
      return () => {
        cancelled = true
        unsub?.()
      }
    }

    getCloud().then((cloud) => {
      if (cancelled) return
      if (!cloud) {
        startLocal()
        return
      }
      const { db, sdk } = cloud
      unsub = sdk.onSnapshot(
        sdk.collection(db, coll),
        (snap) => {
          onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as T[])
        },
        (err) => {
          console.error(`[firestore] ${coll}:`, err)
        },
      )
    })

    return () => {
      cancelled = true
      unsub?.()
    }
  },

  async getDoc(coll: string, id: string): Promise<Doc | null> {
    const cloud = await getCloud()
    if (cloud) {
      const snap = await cloud.sdk.getDoc(cloud.sdk.doc(cloud.db, coll, id))
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }
    const list = lsRead(coll)
    return list.find((d) => d.id === id) ?? null
  },

  async setDoc(coll: string, id: string, data: Doc) {
    const cloud = await getCloud()
    if (cloud) {
      await cloud.sdk.setDoc(cloud.sdk.doc(cloud.db, coll, id), data, { merge: true })
      return
    }
    const list = lsRead(coll)
    const idx = list.findIndex((d) => d.id === id)
    if (idx >= 0) list[idx] = { ...list[idx], ...data }
    else list.push({ id, ...data })
    lsWrite(coll, list)
  },

  async statsGet(id: string): Promise<Doc> {
    const data = await store.getDoc('stats', id)
    return data ?? {}
  },

  async statsSet(id: string, data: Doc) {
    await store.setDoc('stats', id, data)
  },

  async statsIncrement(id: string, field: string) {
    const cloud = await getCloud()
    if (cloud) {
      await cloud.sdk.setDoc(
        cloud.sdk.doc(cloud.db, 'stats', id),
        { [field]: cloud.sdk.increment(1) },
        { merge: true },
      )
      return
    }
    const cur = await store.getDoc('stats', id)
    const next = { ...cur, [field]: (Number(cur?.[field]) || 0) + 1 }
    await store.setDoc('stats', id, next)
  },
}
