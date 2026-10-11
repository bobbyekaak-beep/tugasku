import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface Props {
  screenName: string;
  withNav: boolean;
  children: ReactNode;
}

const MEMBERS = 'Bobby Eka Angga Kusuma · Tyo Dzaky Kamaludin · Geraldy Fauzy Setiabudi';

/**
 * Di layar lebar (laptop), aplikasi tampil di dalam bingkai iPhone 16 Pro Max seperti mockup.
 * Di layar HP, bingkai hilang dan aplikasi memenuhi layar.
 */
const PHONE_HEIGHT = 1000; // tinggi bingkai asli (px), lebar 484px
const RESERVED = 170; // ruang untuk judul, nama kelompok, dan jarak

export function DeviceFrame({ screenName, withNav, children }: Props) {
  const phoneRef = useRef<HTMLDivElement>(null);

  // Bentuk HP selalu sama seperti mockup. Kalau layar kurang tinggi, seluruh HP
  // diperkecil secara proporsional (bukan dipendekkan) supaya isinya tidak terpotong.
  useEffect(() => {
    const fit = () => {
      const scale = Math.min(1, (window.innerHeight - RESERVED) / PHONE_HEIGHT);
      phoneRef.current?.style.setProperty('--phone-scale', String(Math.max(scale, 0.5)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="stage">
      <div className="stage-head">
        <p className="stage-title">TugasKu</p>
        <p className="stage-sub">Skeleton · {screenName}</p>
      </div>

      <div className="phone" ref={phoneRef}>
        <span className="phone-btn phone-btn-mute" aria-hidden="true" />
        <span className="phone-btn phone-btn-up" aria-hidden="true" />
        <span className="phone-btn phone-btn-down" aria-hidden="true" />
        <span className="phone-btn phone-btn-power" aria-hidden="true" />

        <div className={`phone-screen ${withNav ? 'with-nav' : ''}`}>
          <div className="status-bar" aria-hidden="true">
            <span className="status-time">09:41</span>
            <span className="island" />
            <span className="status-icons">
              <svg width="20" height="14" viewBox="0 0 20 14" fill="currentColor">
                <rect x="0" y="9" width="4" height="5" rx="1" />
                <rect x="5.3" y="6" width="4" height="8" rx="1" />
                <rect x="10.6" y="3" width="4" height="11" rx="1" />
                <rect x="16" y="0" width="4" height="14" rx="1" />
              </svg>
              <svg width="28" height="13" viewBox="0 0 28 13" fill="currentColor">
                <rect
                  x="0.5"
                  y="0.5"
                  width="24"
                  height="12"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  opacity="0.4"
                />
                <rect x="2" y="2" width="21" height="9" rx="2.5" />
                <path d="M26 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" opacity="0.5" />
              </svg>
            </span>
          </div>

          <main className="content">{children}</main>

          {withNav && <BottomNav />}
          <div className="home-indicator" aria-hidden="true" />
        </div>
      </div>

      <div className="stage-foot">
        <p className="stage-group">Kelompok Josjis</p>
        <p className="caption">{MEMBERS}</p>
      </div>
    </div>
  );
}
