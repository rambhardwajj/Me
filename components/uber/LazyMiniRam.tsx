'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Mini Ram brings an animation library with it. On this page it only opens from "Ask Mini Ram",
// so its code is fetched once the page is idle, or at once if a visitor asks first.
const Mascot = dynamic(() => import('@/components/Mascot'), { ssr: false });
const NO_COMMENTS = {};

export default function LazyMiniRam() {
  const [load, setLoad] = useState(false);
  /** The visitor asked before the code had arrived: open the chat as soon as it does. */
  const [asked, setAsked] = useState(false);
  useEffect(() => {
    const onOpen = () => {
      setAsked(true);
      setLoad(true);
    };
    window.addEventListener('mini-ram:open', onOpen);
    const idle = window.setTimeout(() => setLoad(true), 3500);
    return () => {
      window.removeEventListener('mini-ram:open', onOpen);
      window.clearTimeout(idle);
    };
  }, []);
  return load ? <Mascot comments={NO_COMMENTS} startOpen={asked} /> : null;
}
