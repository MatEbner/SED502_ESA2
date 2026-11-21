import { useEffect, useState } from 'react'
import type { LadeStatus, Ort, Sonnenzeiten, WetterStunde } from '../typen'

interface AufbereiteteVorhersage {
  stunden: WetterStunde[]
  sonnenzeitenNachTag: Record<string, Sonnenzeiten>
}

interface UseWetterErgebnis {
  stunden: WetterStunde[]
  sonnenzeiten: Sonnenzeiten | null
  status: LadeStatus
  fehler: string | null
}

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === 'object' && wert !== null
}

function sindZeichenketten(wert: unknown): wert is string[] {
  return (
    Array.isArray(wert) &&
    wert.every((element: unknown): boolean => typeof element === 'string')
  )
}

function sindZahlen(wert: unknown): wert is number[] {
  return (
    Array.isArray(wert) &&
    wert.every((element: unknown): boolean => typeof element === 'number')
  )
}

function leseVorhersage(antwort: unknown): AufbereiteteVorhersage {
  if (
    !istObjekt(antwort) ||
    !istObjekt(antwort.hourly) ||
    !istObjekt(antwort.daily)
  ) {
    throw new Error('Die Wettervorhersage hat ein ungültiges Format.')
  }

  const stundenZeit = antwort.hourly.time
  const bewoelkung = antwort.hourly.cloud_cover
  const bewoelkungTief = antwort.hourly.cloud_cover_low
  const bewoelkungMittel = antwort.hourly.cloud_cover_mid
  const bewoelkungHoch = antwort.hourly.cloud_cover_high
  const regenwahrscheinlichkeit = antwort.hourly.precipitation_probability
  const wind = antwort.hourly.wind_speed_10m

  if (
    !sindZeichenketten(stundenZeit) ||
    !sindZahlen(bewoelkung) ||
    !sindZahlen(bewoelkungTief) ||
    !sindZahlen(bewoelkungMittel) ||
    !sindZahlen(bewoelkungHoch) ||
    !sindZahlen(regenwahrscheinlichkeit) ||
    !sindZahlen(wind) ||
    bewoelkung.length !== stundenZeit.length ||
    bewoelkungTief.length !== stundenZeit.length ||
    bewoelkungMittel.length !== stundenZeit.length ||
    bewoelkungHoch.length !== stundenZeit.length ||
    regenwahrscheinlichkeit.length !== stundenZeit.length ||
    wind.length !== stundenZeit.length
  ) {
    throw new Error('Die stündlichen Wetterdaten sind unvollständig.')
  }

  const tage = antwort.daily.time
  const sonnenaufgaenge = antwort.daily.sunrise
  const sonnenuntergaenge = antwort.daily.sunset

  if (
    !sindZeichenketten(tage) ||
    !sindZeichenketten(sonnenaufgaenge) ||
    !sindZeichenketten(sonnenuntergaenge) ||
    sonnenaufgaenge.length !== tage.length ||
    sonnenuntergaenge.length !== tage.length
  ) {
    throw new Error('Die Sonnenzeiten sind unvollständig.')
  }

  const stunden: WetterStunde[] = stundenZeit.map(
    (zeit: string, index: number): WetterStunde => ({
      zeit,
      bewoelkung: bewoelkung[index],
      bewoelkungTief: bewoelkungTief[index],
      bewoelkungMittel: bewoelkungMittel[index],
      bewoelkungHoch: bewoelkungHoch[index],
      regenwahrscheinlichkeit: regenwahrscheinlichkeit[index],
      wind: wind[index],
    }),
  )

  const sonnenzeitenNachTag: Record<string, Sonnenzeiten> = {}

  tage.forEach((tag: string, index: number): void => {
    sonnenzeitenNachTag[tag] = {
      sonnenaufgang: sonnenaufgaenge[index],
      sonnenuntergang: sonnenuntergaenge[index],
    }
  })

  return { stunden, sonnenzeitenNachTag }
}

function useWetter(ort: Ort | null, datum: string): UseWetterErgebnis {
  const [alleStunden, setAlleStunden] = useState<WetterStunde[]>([])
  const [sonnenzeitenNachTag, setSonnenzeitenNachTag] = useState<
    Record<string, Sonnenzeiten>
  >({})
  const [status, setStatus] = useState<LadeStatus>('idle')
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect((): (() => void) | void => {
    const angefragterOrt = ort

    if (angefragterOrt === null) {
      setAlleStunden([])
      setSonnenzeitenNachTag({})
      setFehler(null)
      setStatus('idle')
      return
    }

    const breitengrad = String(angefragterOrt.breitengrad)
    const laengengrad = String(angefragterOrt.laengengrad)
    const controller = new AbortController()

    async function ladeWetter(): Promise<void> {
      setAlleStunden([])
      setSonnenzeitenNachTag({})
      setFehler(null)
      setStatus('loading')

      const parameter = new URLSearchParams({
        latitude: breitengrad,
        longitude: laengengrad,
        hourly:
          'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,precipitation_probability,wind_speed_10m',
        daily: 'sunrise,sunset',
        timezone: 'auto',
        forecast_days: '7',
      })

      try {
        const antwort = await fetch(
          `https://api.open-meteo.com/v1/forecast?${parameter.toString()}`,
          { signal: controller.signal },
        )

        if (!antwort.ok) {
          throw new Error('Die Wettervorhersage ist momentan nicht verfügbar.')
        }

        const daten: unknown = await antwort.json()
        const aufbereiteteVorhersage = leseVorhersage(daten)
        setAlleStunden(aufbereiteteVorhersage.stunden)
        setSonnenzeitenNachTag(aufbereiteteVorhersage.sonnenzeitenNachTag)
        setStatus('success')
      } catch (ursache: unknown) {
        if (ursache instanceof DOMException && ursache.name === 'AbortError') {
          return
        }

        setAlleStunden([])
        setSonnenzeitenNachTag({})
        setFehler(
          ursache instanceof Error && ursache.message.startsWith('Die ')
            ? ursache.message
            : 'Die Wettervorhersage konnte nicht geladen werden. Bitte prüfe deine Verbindung und versuche es erneut.',
        )
        setStatus('error')
      }
    }

    void ladeWetter()

    return (): void => {
      controller.abort()
    }
  }, [ort])

  const stunden = alleStunden.filter((stunde: WetterStunde): boolean =>
    stunde.zeit.startsWith(`${datum}T`),
  )

  return {
    stunden,
    sonnenzeiten: sonnenzeitenNachTag[datum] ?? null,
    status,
    fehler,
  }
}

export default useWetter
