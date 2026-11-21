export type Motiv = 'Landschaft' | 'Architektur' | 'Portrait' | 'Stadt'

export type LadeStatus = 'idle' | 'loading' | 'success' | 'error'

export interface Ort {
  id: number
  name: string
  land: string
  region?: string
  breitengrad: number
  laengengrad: number
}

export interface WetterStunde {
  zeit: string // Lokaler ISO-String ohne Zeitzone, z. B. "2026-11-27T07:00"
  bewoelkung: number // Prozent
  bewoelkungTief: number
  bewoelkungMittel: number
  bewoelkungHoch: number
  regenwahrscheinlichkeit: number // Prozent
  wind: number // km/h
}

export interface BewerteteStunde extends WetterStunde {
  score: number // 0 bis 100
}

export interface Sonnenzeiten {
  sonnenaufgang: string
  sonnenuntergang: string
}

export interface BriefingDaten {
  ort: string
  datum: string // "2026-11-27"
  motiv: Motiv
  sonnenaufgang: string
  sonnenuntergang: string
  stunden: BewerteteStunde[]
}
