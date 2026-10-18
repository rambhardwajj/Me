'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { EASE } from './Motion';

export type Photo = { src: string; title: string; caption: string; body?: string; points?: string[] };

/** Full-screen photo viewer: Esc or a click outside closes it, arrows step through the set. */
export default function Lightbox({ photos, index, onChange }: { photos: Photo[]; index: number | null; onChange: (i: number | null) => void }) {
  const open = index !== null;
  const photo = open ? photos[index] : null;

  useEffect(() => {
    if (!open) return;
    const step = (d: number) => onChange((index + d + photos.length) % photos.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, index, photos.length, onChange]);

  const step = (d: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) onChange((index + d + photos.length) % photos.length);
  };

  return (
    <AnimatePresence>
      {photo && (
        <motion.div className="lb" role="dialog" aria-modal="true" aria-label={photo.title} onClick={() => onChange(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button className="lb-close" onClick={() => onChange(null)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          {photos.length > 1 && (
            <>
              <button className="lb-nav prev" onClick={step(-1)} aria-label="Previous photo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </button>
              <button className="lb-nav next" onClick={step(1)} aria-label="Next photo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </>
          )}

          <motion.figure key={photo.src} className="lb-figure" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.title} />
            <figcaption>
              <div className="lb-head">
                <b>{photo.title}</b>
                <span>{photo.caption}</span>
                <i>
                  {index! + 1} / {photos.length}
                </i>
              </div>
              {photo.body && <p className="lb-body">{photo.body}</p>}
              {photo.points && (
                <ul className="lb-points">
                  {photo.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
