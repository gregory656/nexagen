import { useEffect, useRef } from 'react'

const AdSense = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
}) => {
  const adRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !adSlot || initializedRef.current) return

    const adElement = adRef.current
    if (adElement?.dataset.adsbygoogleStatus) {
      initializedRef.current = true
      return
    }

    try {
      const adsbygoogle = window.adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      initializedRef.current = true
    } catch (err) {
      console.error('AdSense Error:', err)
    }
  }, [adSlot])

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', ...style }}
      data-ad-client="ca-pub-6022827152219832"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  )
}

export default AdSense
