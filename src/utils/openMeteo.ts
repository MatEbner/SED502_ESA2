import type { Ort } from '../typen'

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === 'object' && wert !== null
}

function leseOpenMeteoOrt(wert: unknown): Ort {
  if (
    !istObjekt(wert) ||
    typeof wert.id !== 'number' ||
    typeof wert.name !== 'string' ||
    typeof wert.country !== 'string' ||
    typeof wert.latitude !== 'number' ||
    typeof wert.longitude !== 'number'
  ) {
    throw new Error('Die Ortsdaten von Open-Meteo sind ungültig.')
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

export default leseOpenMeteoOrt
