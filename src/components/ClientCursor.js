'use client';
import { useEffect, useRef } from 'react';

export default function ClientCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    // Hide on touch devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ring = ringRef.current;
    const dot  = dotRef.current;
    if (!ring || !dot) return;

    ring.style.display = 'block';
    dot.style.display  = 'block';

    let rx = 0, ry = 0; // ring coords (lerped)
    let mx = 0, my = 0; // mouse coords

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const onEnter = () => ring.classList.add('hovered');
    const onLeave = () => ring.classList.remove('hovered');

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label, .btn, .hp-svc-card, .proj-card')) {
        ring.classList.add('hovered');
      } else {
        ring.classList.remove('hovered');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="hs-cursor" style={{ display: 'none' }} aria-hidden="true" />
      <div ref={dotRef}  className="hs-cursor-dot" style={{ display: 'none' }} aria-hidden="true" />
    </>
  );
}
