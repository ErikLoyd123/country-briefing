import { useCallback, useEffect, useState } from 'react';
import { SCENES } from './scenes.jsx';

// Keyboard-driven presenter. → / Space / PageDown next · ← / PageUp previous · Home / End
// N toggles speaker notes · F toggles fullscreen · ?scene=N deep-links (1-based).
export default function Deck({ scenes }) {
  const total = scenes.length;
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);

  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('scene'));
    if (Number.isInteger(n) && n >= 1 && n <= total) setIndex(n - 1);
  }, [total]);

  const go = useCallback(
    (i) => {
      const next = Math.min(total - 1, Math.max(0, i));
      setIndex(next);
      const url = new URL(window.location.href);
      url.searchParams.set('scene', String(next + 1));
      window.history.replaceState(null, '', url);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(total - 1);
      else if (e.key.toLowerCase() === 'n') setNotes((v) => !v);
      else if (e.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (e.key === 'Escape') setNotes(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, total]);

  const scene = scenes[index];
  const Scene = SCENES[scene.scene];
  const next = scenes[index + 1];

  return (
    <div className="deck fixed inset-0 grid place-items-center bg-[#05090c]">
      <div className="stage relative overflow-hidden" onClick={(e) => (e.clientX > window.innerWidth / 3 ? go(index + 1) : go(index - 1))}>
        <div key={scene.id} className="scene absolute inset-0">
          <Scene {...scene.props} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-[2.5cqw] pb-[1.2cqw] text-[1cqw] opacity-70 mix-blend-difference text-white">
          <span>{scene.presenter}</span>
          <span className="num">
            {index + 1} / {total}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[0.25cqw] bg-white/10">
          <div className="h-full bg-sg transition-[width] duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {notes && (
        <aside className="fixed inset-x-4 bottom-4 max-h-[40vh] overflow-auto rounded-lg border border-white/15 bg-[#0e1a22]/95 p-5 text-sm text-on-night shadow-2xl md:inset-x-auto md:right-4 md:w-[28rem]">
          <p className="text-on-night-muted">
            Scene {index + 1} of {total} · {scene.presenter}
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed">{scene.notes || 'No notes for this scene.'}</p>
          {next && <p className="mt-4 text-on-night-muted">Next: {next.props.title ?? next.props.text ?? next.id}</p>}
          <p className="mt-4 text-xs text-on-night-muted">← → move · N notes · F fullscreen</p>
        </aside>
      )}
    </div>
  );
}
