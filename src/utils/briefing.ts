import type {
  BewerteteStunde,
  BriefingDaten,
  Motiv,
  Ort,
  Sonnenzeiten,
} from '../typen'

function baueBriefingDaten(
  ort: Ort,
  datum: string,
  motiv: Motiv,
  stunden: BewerteteStunde[],
  sonnenzeiten: Sonnenzeiten,
): BriefingDaten {
  return {
    ort: ort.name,
    datum,
    motiv,
    sonnenaufgang: sonnenzeiten.sonnenaufgang,
    sonnenuntergang: sonnenzeiten.sonnenuntergang,
    stunden,
  }
}

export default baueBriefingDaten
