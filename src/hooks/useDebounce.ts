import { useEffect, useState } from 'react'

function useDebounce(suchbegriff: string, verzoegerung: number): string {
  const [verzoegerterSuchbegriff, setVerzoegerterSuchbegriff] =
    useState<string>(suchbegriff)

  useEffect((): (() => void) => {
    const timer = window.setTimeout((): void => {
      setVerzoegerterSuchbegriff(suchbegriff)
    }, verzoegerung)

    return (): void => {
      window.clearTimeout(timer)
    }
  }, [suchbegriff, verzoegerung])

  return verzoegerterSuchbegriff
}

export default useDebounce
