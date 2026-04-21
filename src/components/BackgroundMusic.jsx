import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import './BackgroundMusic.css';

// ✏️  Paste your YouTube video ID here (the part after ?v=)
// e.g. for https://www.youtube.com/watch?v=E0vdHE4BXXY → 'E0vdHE4BXXY'
const VIDEO_ID = 'E0vdHE4BXXY';

export default function BackgroundMusic() {
  const { t } = useLang();
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => initPlayer();
    return () => { window.onYouTubeIframeAPIReady = null; };
  }, []);

  function initPlayer() {
    playerRef.current = new window.YT.Player('yt-bg-player', {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,      // we trigger play manually after first interaction
        loop: 1,
        playlist: VIDEO_ID,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        mute: 1,          // start muted so browser allows autoplay
      },
      events: {
        onReady: () => setReady(true),
        onStateChange: (e) => {
          // YT.PlayerState.PLAYING = 1
          setPlaying(e.data === 1);
        },
      },
    });
  }

  // Auto-start on first user interaction (browser policy requires a gesture)
  useEffect(() => {
    if (!ready || userStarted) return;
    const start = () => {
      playerRef.current?.playVideo();
      playerRef.current?.unMute();
      setUserStarted(true);
      setPlaying(true);
      ['click', 'touchstart', 'keydown'].forEach(ev =>
        document.removeEventListener(ev, start)
      );
    };
    ['click', 'touchstart', 'keydown'].forEach(ev =>
      document.addEventListener(ev, start, { once: true })
    );
    return () => {
      ['click', 'touchstart', 'keydown'].forEach(ev =>
        document.removeEventListener(ev, start)
      );
    };
  }, [ready, userStarted]);

  const toggle = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      playerRef.current.unMute();
      setUserStarted(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube player iframe — rendered off-screen */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <div id="yt-bg-player" ref={iframeRef} />
      </div>

      {/* Floating music toggle button */}
      <button
        className={`music-fab ${playing ? 'playing' : ''} ${ready ? 'visible' : ''}`}
        onClick={toggle}
        title={playing ? t.bgMusicOff : t.bgMusicOn}
        aria-label={playing ? t.bgMusicOff : t.bgMusicOn}
      >
        <span className="music-fab-icon">{playing ? '♫' : '♪'}</span>
        <span className="music-fab-label">{playing ? t.bgMusicOff : t.bgMusicOn}</span>
      </button>
    </>
  );
}
