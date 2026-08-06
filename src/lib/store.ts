import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { firestore, isCloudConnected } from './firebase'

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

async function cloudList(coll: string): Promise<Doc[]> {
  const ref = collection(firestore!, coll)
  const snap = await getDocs(ref)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

async function cloudAdd(coll: string, data: Doc): Promise<string> {
  const ref = collection(firestore!, coll)
  const res = await addDoc(ref, data)
  return res.id
}

async function cloudUpdate(coll: string, id: string, patch: Doc) {
  const ref = doc(firestore!, coll, id)
  await updateDoc(ref, patch)
}

async function cloudRemove(coll: string, id: string) {
  const ref = doc(firestore!, coll, id)
  await deleteDoc(ref)
}

async function cloudGetDoc(coll: string, id: string): Promise<Doc | null> {
  const ref = doc(firestore!, coll, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

async function cloudSetDoc(coll: string, id: string, data: Doc) {
  const ref = doc(firestore!, coll, id)
  await setDoc(ref, data, { merge: true })
}

export const store = {
  isCloud: () => isCloudConnected(),

  async list<T>(coll: string): Promise<T[]> {
    if (isCloudConnected()) return (await cloudList(coll)) as unknown as T[]
    return lsRead(coll) as unknown as T[]
  },

  async add(coll: string, data: Record<string, unknown>): Promise<string> {
    if (isCloudConnected()) return cloudAdd(coll, data)
    const list = lsRead(coll)
    const id = uid()
    list.push({ id, ...data })
    lsWrite(coll, list)
    return id
  },

  async update(coll: string, id: string, patch: Record<string, unknown>) {
    if (isCloudConnected()) return cloudUpdate(coll, id, patch)
    const list = lsRead(coll)
    const idx = list.findIndex((d) => d.id === id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...patch }
      lsWrite(coll, list)
    }
  },

  async remove(coll: string, id: string) {
    if (isCloudConnected()) return cloudRemove(coll, id)
    const list = lsRead(coll).filter((d) => d.id !== id)
    lsWrite(coll, list)
  },

  subscribe<T>(
    coll: string,
    onChange: (items: T[]) => void,
  ): () => void {
    if (isCloudConnected()) {
      const ref = collection(firestore!, coll)
      return onSnapshot(
        ref,
        (snap) => {
          onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T))
        },
        (err) => {
          console.error(`[firestore] ${coll}:`, err)
        },
      )
    }
    const emit = () => onChange(lsRead(coll) as unknown as T[])
    emit()
    return addLocalListener(coll, emit)
  },

  async getDoc(coll: string, id: string): Promise<Doc | null> {
    if (isCloudConnected()) return cloudGetDoc(coll, id)
    const list = lsRead(coll)
    return list.find((d) => d.id === id) ?? null
  },

  async setDoc(coll: string, id: string, data: Doc) {
    if (isCloudConnected()) return cloudSetDoc(coll, id, data)
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
    if (isCloudConnected()) {
      const ref = doc(firestore!, 'stats', id)
      await setDoc(ref, { [field]: increment(1) }, { merge: true })
      return
    }
    const cur = await store.getDoc('stats', id)
    const next = { ...cur, [field]: (Number(cur?.[field]) || 0) + 1 }
    await store.setDoc('stats', id, next)
  },
}
