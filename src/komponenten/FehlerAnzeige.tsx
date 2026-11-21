import type { JSX } from 'react'

interface FehlerAnzeigeProps {
  nachricht: string
}

function FehlerAnzeige({ nachricht }: FehlerAnzeigeProps): JSX.Element {
  return (
    <p className="statusanzeige statusanzeige--fehler" role="alert">
      {nachricht}
    </p>
  )
}

export default FehlerAnzeige
