import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../context/LangContext';
import './BackgroundMusic.css';

// ✏️  Replace with your YouTube video ID (the part after ?v= in the URL)
const VIDEO_ID = '1odRg-2BfXs';

// Global flag so the YT script is only injected once across React re-renders
let ytScriptInjected = false;
// Queue of callbacks waiting for the API to be ready
const ytReadyCallbacks = [];

function loadYTApi(callback) {
  // If already loaded, fire immediately
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  // Queue the callback
  ytReadyCallbacks.push(callback);
  // Only inject the script tag once
  if (!ytScriptInjected) {
    ytScriptInjected = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    // YouTube calls this global when ready
    window.onYouTubeIframeAPIReady = () => {
      ytReadyCallbacks.forEach(cb => cb());
      ytReadyCallbacks.length = 0;
    };
  }
}

export default function BackgroundMusic() {
  const { t } = useLang();
  const playerRef    = useRef(null);
  const containerRef = useRef(null);
  const [ready,   setReady]   = useState(false);
  const [playing, setPlaying] = useState(false);

  // ── Build the YT player ────────────────────────────────────────
  const initPlayer = useCallback(() => {
    if (!containerRef.current) return;
    // Destroy any existing player first (handles hot-reloads)
    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
    }
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: VIDEO_ID,
      width: '1',
      height: '1',
      playerVars: {
        autoplay:       0,
        loop:           1,
        playlist:       VIDEO_ID, // required for loop to work
        controls:       0,
        disablekb:      1,
        fs:             0,
        modestbranding: 1,
        rel:            0,
        mute:           1,  // muted so browser autoplay policy is satisfied
      },
      events: {
        onReady: () => setReady(true),
        onStateChange: (e) => setPlaying(e.data === window.YT.PlayerState.PLAYING),
        onError: (e) => console.warn('YT player error:', e.data),
      },
    });
  }, []);

  // ── Load API & init player on mount ───────────────────────────
  useEffect(() => {
    loadYTApi(initPlayer);
    return () => {
      // Cleanup on unmount
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
      }
    };
  }, [initPlayer]);

  // ── Auto-play on first user gesture (browser policy) ──────────
  useEffect(() => {
    if (!ready) return;

    const startOnGesture = () => {
      const p = playerRef.current;
      if (!p) return;
      p.unMute();
      p.setVolume(70);
      p.playVideo();
    };

    const EVENTS = ['click', 'touchstart', 'keydown', 'scroll'];
    EVENTS.forEach(ev => document.addEventListener(ev, startOnGesture, { once: true, passive: true }));

    return () => {
      EVENTS.forEach(ev => document.removeEventListener(ev, startOnGesture));
    };
  }, [ready]);

  // ── Toggle play / pause ────────────────────────────────────────
  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pauseVideo();
    } else {
      p.unMute();
      p.setVolume(70);
      p.playVideo();
    }
  };

  return (
    <>
      {/* Invisible 1×1 player container — must stay in the DOM */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={containerRef} />
      </div>

      {/* Floating toggle button — only appears once player is ready */}
      {ready && (
        <button
          className={`music-fab visible ${playing ? 'playing' : ''}`}
          onClick={toggle}
          title={playing ? t.bgMusicOff : t.bgMusicOn}
          aria-label={playing ? t.bgMusicOff : t.bgMusicOn}
        >
          <span className="music-fab-icon">{playing ? '♫' : '♪'}</span>
          <span className="music-fab-label">{playing ? t.bgMusicOff : t.bgMusicOn}</span>
        </button>
      )}
    </>
  );
}
