import type {
  BewerteteStunde,
  Motiv,
  Sonnenzeiten,
  WetterStunde,
} from '../typen'

const REGEN_ABZUG_PRO_PROZENT = 0.7
const WIND_GRENZE_KMH = 15
const WIND_ABZUG_PRO_KMH = 2
const GOLDENE_STUNDE_BONUS = 12

function zuMinuten(zeit: string): number {
  const treffer = zeit.match(/T(\d{2}):(\d{2})$/)

  if (treffer === null) {
    throw new Error('Die lokale Uhrzeit hat ein ungültiges Format.')
  }

  const stunden = Number(treffer[1])
  const minuten = Number(treffer[2])

  if (stunden > 23 || minuten > 59) {
    throw new Error('Die lokale Uhrzeit liegt außerhalb des gültigen Bereichs.')
  }

  return stunden * 60 + minuten
}

export function istImTageslicht(
  zeit: string,
  sonnenzeiten: Sonnenzeiten,
): boolean {
  const minuten = zuMinuten(zeit)
  const sonnenaufgang = zuMinuten(sonnenzeiten.sonnenaufgang)
  const sonnenuntergang = zuMinuten(sonnenzeiten.sonnenuntergang)

  return minuten >= sonnenaufgang - 60 && minuten <= sonnenuntergang + 60
}

export function istGoldeneStunde(
  zeit: string,
  sonnenzeiten: Sonnenzeiten,
): boolean {
  const minuten = zuMinuten(zeit)
  const sonnenaufgang = zuMinuten(sonnenzeiten.sonnenaufgang)
  const sonnenuntergang = zuMinuten(sonnenzeiten.sonnenuntergang)

  return (
    (minuten >= sonnenaufgang && minuten <= sonnenaufgang + 60) ||
    (minuten >= sonnenuntergang - 60 && minuten <= sonnenuntergang)
  )
}

function bewerteBewoelkung(stunde: WetterStunde, motiv: Motiv): number {
  switch (motiv) {
    case 'Landschaft':
      if (stunde.bewoelkungMittel + stunde.bewoelkungHoch >= 60) {
        return 12
      }
      return stunde.bewoelkungMittel + stunde.bewoelkungHoch <= 20 ? -5 : 0
    case 'Architektur':
      if (stunde.bewoelkung <= 25) {
        return 10
      }
      return stunde.bewoelkung >= 75 ? -10 : 0
    case 'Portrait':
      if (stunde.bewoelkung >= 35 && stunde.bewoelkung <= 70) {
        return 12
      }
      return stunde.bewoelkung > 85 ? -5 : 0
    case 'Stadt':
      if (stunde.bewoelkung <= 35) {
        return 8
      }
      return stunde.bewoelkung >= 80 ? -8 : 0
    default:
      throw new Error('Das Fotomotiv ist ungültig.')
  }
}

export function berechneFotoScore(
  stunde: WetterStunde,
  motiv: Motiv,
  sonnenzeiten: Sonnenzeiten,
): number {
  if (!istImTageslicht(stunde.zeit, sonnenzeiten)) {
    return 0
  }

  const regenAbzug =
    stunde.regenwahrscheinlichkeit * REGEN_ABZUG_PRO_PROZENT
  const windAbzug =
    Math.max(0, stunde.wind - WIND_GRENZE_KMH) * WIND_ABZUG_PRO_KMH
  const goldeneStundeBonus = istGoldeneStunde(stunde.zeit, sonnenzeiten)
    ? GOLDENE_STUNDE_BONUS
    : 0
  const wolkenPunkte = bewerteBewoelkung(stunde, motiv)
  const score = Math.round(
    100 - regenAbzug - windAbzug + goldeneStundeBonus + wolkenPunkte,
  )

  return Math.min(100, Math.max(0, score))
}

export function besteZeitfenster(
  stunden: BewerteteStunde[],
  anzahl: number,
): BewerteteStunde[] {
  if (!Number.isFinite(anzahl) || anzahl < 1) {
    return []
  }

  return [...stunden]
    .sort(
      (ersteStunde: BewerteteStunde, zweiteStunde: BewerteteStunde): number =>
        zweiteStunde.score - ersteStunde.score ||
        ersteStunde.zeit.localeCompare(zweiteStunde.zeit),
    )
    .slice(0, Math.floor(anzahl))
}
