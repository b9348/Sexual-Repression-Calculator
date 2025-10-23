import { useEffect } from 'react';

declare global {
  interface Window {
    __monetagZoneLoaded?: Record<string, boolean>;
  }
}

type MonetagTagProps = {
  zoneId: string;
  src?: string;
};

export default function MonetagTag({ zoneId, src = 'https://fpyf8.com/88/tag.min.js' }: MonetagTagProps) {
  useEffect(() => {
    if (!window.__monetagZoneLoaded) window.__monetagZoneLoaded = {};
    if (window.__monetagZoneLoaded[zoneId]) return;

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-zone', zoneId);
    script.setAttribute('data-cfasync', 'false');
    script.id = `monetag-tag-${zoneId}`;

    document.body.appendChild(script);
    window.__monetagZoneLoaded[zoneId] = true;

    // 不在卸载时移除脚本，避免重复加载导致投放异常
  }, [zoneId, src]);

  return null;
}
