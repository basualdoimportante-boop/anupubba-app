// src/components/ReproductorMeditacion.jsx
import { useState, useRef, useEffect } from 'react';

function ReproductorMeditacion({ audioUrl, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newTime = x * audio.duration;
    audio.currentTime = newTime;
    setProgress((newTime / audio.duration) * 100);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '12px' }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={togglePlay}
          style={{
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>{formatTime(currentTime)}</span>
            <div
              onClick={handleSeek}
              style={{
                flex: 1,
                height: '6px',
                background: '#ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#6C63FF',
                  borderRadius: '3px'
                }}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReproductorMeditacion;
