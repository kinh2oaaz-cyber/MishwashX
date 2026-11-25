/**
 * Minimal IndexedDB wrapper used by Local Studio mode for media blobs.
 * Media is stored as data URLs so uploaded images survive a page reload
 * without requiring a backend.
 */

const DB_NAME = 'mishawash-x-studio'
const DB_VERSION = 1
const STORE = 'media'

let dbPromise = null

function openDb() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB unavailable'))
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function tx(mode, fn) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode)
    const store = transaction.objectStore(STORE)
    let result
    try {
      result = fn(store)
    } catch (err) {
      reject(err)
      return
    }
    transaction.oncomplete = () => resolve(result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export const mediaDb = {
  async all() {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  },
  async put(record) {
    await tx('readwrite', (store) => store.put(record))
    return record
  },
  async remove(id) {
    await tx('readwrite', (store) => store.delete(id))
  },
  async clear() {
    await tx('readwrite', (store) => store.clear())
  },
}

/** Read a File as a data URL. */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
