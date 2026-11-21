import { useEffect, useState } from 'react'
import type { LadeStatus, Ort } from '../typen'

interface UseGeocodingErgebnis {
  orte: Ort[]
  status: LadeStatus
  fehler: string | null
}

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === 'object' && wert !== null
}

function leseOrt(wert: unknown): Ort {
  if (
    !istObjekt(wert) ||
    typeof wert.id !== 'number' ||
    typeof wert.name !== 'string' ||
    typeof wert.country !== 'string' ||
    typeof wert.latitude !== 'number' ||
    typeof wert.longitude !== 'number'
  ) {
    throw new Error('Die Ortssuche hat ein ungültiges Ergebnis geliefert.')
  }

  const ort: Ort = {
    id: wert.id,
    name: wert.name,
    land: wert.country,
    breitengrad: wert.latitude,
    laengengrad: wert.longitude,
  }

  if (typeof wert.admin1 === 'string') {
    ort.region = wert.admin1
  }

  return ort
}

function leseOrte(antwort: unknown): Ort[] {
  if (!istObjekt(antwort)) {
    throw new Error('Die Ortssuche hat eine ungültige Antwort geliefert.')
  }

  const ergebnisse = antwort.results

  if (ergebnisse === undefined) {
    return []
  }

  if (!Array.isArray(ergebnisse)) {
    throw new Error('Die Ortssuche hat eine ungültige Antwort geliefert.')
  }

  return ergebnisse.map(leseOrt)
}

function useGeocoding(suchbegriff: string): UseGeocodingErgebnis {
  const [orte, setOrte] = useState<Ort[]>([])
  const [status, setStatus] = useState<LadeStatus>('idle')
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect((): (() => void) | void => {
    const bereinigterSuchbegriff = suchbegriff.trim()

    if (bereinigterSuchbegriff.length < 2) {
      setOrte([])
      setStatus('idle')
      setFehler(null)
      return
    }

    const controller = new AbortController()

    async function ladeOrte(): Promise<void> {
      setOrte([])
      setFehler(null)
      setStatus('loading')

      const parameter = new URLSearchParams({
        name: bereinigterSuchbegriff,
        count: '8',
        language: 'de',
        format: 'json',
      })

      try {
        const antwort = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?${parameter.toString()}`,
          { signal: controller.signal },
        )

        if (!antwort.ok) {
          throw new Error('Der Geocoding-Dienst ist momentan nicht erreichbar.')
        }

        const daten: unknown = await antwort.json()
        setOrte(leseOrte(daten))
        setStatus('success')
      } catch (ursache: unknown) {
        if (ursache instanceof DOMException && ursache.name === 'AbortError') {
          return
        }

        setOrte([])
        setFehler(
          ursache instanceof Error && ursache.message.startsWith('Der ')
            ? ursache.message
            : 'Die Ortssuche ist fehlgeschlagen. Bitte prüfe deine Verbindung und versuche es erneut.',
        )
        setStatus('error')
      }
    }

    void ladeOrte()

    return (): void => {
      controller.abort()
    }
  }, [suchbegriff])

  return { orte, status, fehler }
}

export default useGeocoding
