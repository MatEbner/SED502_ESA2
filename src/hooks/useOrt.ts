import { useEffect, useState } from 'react'
import type { LadeStatus, Ort } from '../typen'
import leseOpenMeteoOrt from '../utils/openMeteo'

interface UseOrtErgebnis {
  ort: Ort | null
  status: LadeStatus
  fehler: string | null
}

function useOrt(id: number): UseOrtErgebnis {
  const [ort, setOrt] = useState<Ort | null>(null)
  const [status, setStatus] = useState<LadeStatus>('idle')
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect((): (() => void) | void => {
    if (!Number.isInteger(id) || id < 1) {
      setOrt(null)
      setFehler('Die Orts-ID ist ungültig.')
      setStatus('error')
      return
    }

    const controller = new AbortController()

    async function ladeOrt(): Promise<void> {
      setOrt(null)
      setFehler(null)
      setStatus('loading')

      const parameter = new URLSearchParams({
        id: String(id),
        language: 'de',
      })

      try {
        const antwort = await fetch(
          `https://geocoding-api.open-meteo.com/v1/get?${parameter.toString()}`,
          { signal: controller.signal },
        )

        if (!antwort.ok) {
          throw new Error('Der Ort konnte nicht gefunden werden.')
        }

        const daten: unknown = await antwort.json()
        setOrt(leseOpenMeteoOrt(daten))
        setStatus('success')
      } catch (ursache: unknown) {
        if (ursache instanceof DOMException && ursache.name === 'AbortError') {
          return
        }

        setOrt(null)
        setFehler(
          ursache instanceof Error && ursache.message.startsWith('Die ')
            ? ursache.message
            : 'Der Ort konnte nicht geladen werden. Bitte prüfe deine Verbindung und versuche es erneut.',
        )
        setStatus('error')
      }
    }

    void ladeOrt()

    return (): void => {
      controller.abort()
    }
  }, [id])

  return { ort, status, fehler }
}

export default useOrt
