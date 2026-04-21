import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import './BackgroundMusic.css';

// 🎵 Your working video ID
const VIDEO_ID = '1odRg-2BfXs';

export default function BackgroundMusic() {
  const { t } = useLang();
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  // ✅ Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // ✅ Initialize player
  function initPlayer() {
    playerRef.current = new window.YT.Player('yt-bg-player', {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: VIDEO_ID,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        mute: 1,
        playsinline: 1, // ✅ important for mobile
      },
      events: {
        onReady: () => setReady(true),
        onStateChange: (e) => {
          setPlaying(e.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }

  // ✅ Start on first user interaction
  useEffect(() => {
    if (!ready || userStarted) return;

    const start = () => {
      setTimeout(() => {
        playerRef.current?.unMute();
        playerRef.current?.playVideo();
      }, 200);

      setUserStarted(true);
      setPlaying(true);
    };

    document.body.addEventListener('click', start, { once: true });

    return () => {
      document.body.removeEventListener('click', start);
    };
  }, [ready, userStarted]);

  // ✅ Toggle play/pause
  const toggle = () => {
    if (!playerRef.current) return;

    if (playing) {
      playerRef.current.pauseVideo();
      setPlaying(false);
    } else {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setPlaying(true);
      setUserStarted(true);
    }
  };

  return (
    <>
      {/* ✅ Hidden player (must NOT be 0x0) */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div id="yt-bg-player" />
      </div>

      {/* ✅ Floating button */}
      <button
        className={`music-fab ${playing ? 'playing' : ''} ${
          ready ? 'visible' : ''
        }`}
        onClick={toggle}
        title={playing ? t.bgMusicOff : t.bgMusicOn}
        aria-label={playing ? t.bgMusicOff : t.bgMusicOn}
      >
        <span className="music-fab-icon">
          {playing ? '♫' : '♪'}
        </span>
        <span className="music-fab-label">
          {playing ? t.bgMusicOff : t.bgMusicOn}
        </span>
      </button>
    </>
  );
}
