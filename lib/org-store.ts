import { useSyncExternalStore } from "react"

export interface OrgIdentity {
  name: string
  logoUrl: string | null // data URL or null for default SVG
}

const DEFAULT: OrgIdentity = {
  name: "Assembled Systems",
  logoUrl: null,
}

let state: OrgIdentity = { ...DEFAULT }
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

export function getOrgIdentity(): OrgIdentity {
  return state
}

export function setOrgIdentity(next: Partial<OrgIdentity>) {
  state = { ...state, ...next }
  notify()
}

export function resetOrgIdentity() {
  state = { ...DEFAULT }
  notify()
}

export function useOrgIdentity(): OrgIdentity {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
    () => DEFAULT,
  )
}
