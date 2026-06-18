import { useEffect, useRef, type CSSProperties } from 'react'

type AdSenseProps = {
  adSlot?: string
  adFormat?: string
  adLayoutKey?: string
  style?: CSSProperties
}

export default function AdSense({ adSlot, adFormat = 'auto', adLayoutKey, style = { display: 'block' } }: AdSenseProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !adSlot || initializedRef.current) return

    const adElement = adRef.current
    if (adElement?.dataset.adsbygoogleStatus) {
      initializedRef.current = true
      return
    }

    try {
      const adsbygoogle = ((window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle ??= [])
      adsbygoogle.push({})
      initializedRef.current = true
    } catch (err) {
      console.error('AdSense Error:', err)
    }
  }, [adSlot])

  if (!adSlot) {
    return (
      <div className="grid min-h-24 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs font-bold uppercase tracking-[.14em] text-slate-400">
        Sponsored space
      </div>
    )
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', ...style }}
      data-ad-client="ca-pub-6022827152219832"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout-key={adLayoutKey}
      data-full-width-responsive="true"
    />
  )
}
