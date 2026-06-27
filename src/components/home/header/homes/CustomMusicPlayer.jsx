import React, { useEffect, useRef, useState } from 'react';
import './CustomMusicPlayer.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import hexagonImg from '../../../../assets/hexagon-main.png';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CustomMusicPlayer = ({ src, title, artist, useImage = false, cover }) => {
  const audioRef = useRef(null);
  const settingsRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const defaultCover = hexagonImg; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [src, volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
      audio.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (audio.muted) {
      setVolume(0);
    } else {
      setVolume(0.5);
      audio.volume = 0.5;
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changePlaybackRate = (rate) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="music-player-container">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Đĩa than (Vinyl Record) */}
      <div className={`vinyl-record ${isPlaying ? 'playing' : ''}`}>
        {useImage ? (
          <img 
            src={cover || defaultCover} 
            alt="vinyl label" 
            className="vinyl-label-img" 
          />
        ) : (
          <div className="vinyl-label-text">
            <span>DLUONGTA</span>
          </div>
        )}
        {/* <div className="vinyl-hole"></div> */}
      </div>

      {/* Nội dung Player */}
      <div className="player-content">
        <div className="player-top">
          <div className="track-info">
            <span className="track-title">{title || 'Unknown Title'}</span>
            {artist && <span className="track-artist"><span style={{ fontSize: '16px', fontWeight: 600 }}> - </span>{artist}</span>}
          </div>
          
          <div className="progress-container">
            <span className="time-text">{formatTime(currentTime)}</span>
            <div className="progress-wrapper">
              <input
                type="range"
                className="progress-slider"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                style={{
                  background: `linear-gradient(to right, var(--primary-color) ${progressPercent}%, rgba(255, 255, 255, 0.1) ${progressPercent}%)`
                }}
              />
            </div>
            <span className="time-text">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-bottom">
          <div className="controls-left">
            <button className="play-pause-btn" onClick={togglePlay}>
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </button>
          </div>

          <div className="controls-right">
            <div className="volume-control">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
              </button>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, var(--primary-color) ${volumePercent}%, rgba(255, 255, 255, 0.2) ${volumePercent}%)`
                }}
              />
            </div>

            <div className="settings-menu" ref={settingsRef}>
              <button 
                className={`control-btn ${playbackRate !== 1 ? 'active' : ''}`} 
                onClick={() => setShowSettings(!showSettings)}
              >
                <SettingsIcon fontSize="small" />
              </button>
              {showSettings && (
                <div className="settings-content">
                  {[0.125, 0.25, 0.5, 1, 1.25, 1.5, 2, 4].map((speed) => (
                    <div 
                      key={speed} 
                      className={`settings-item ${playbackRate === speed ? 'active' : ''}`} 
                      onClick={() => changePlaybackRate(speed)}
                    >
                      {speed === 1 ? 'Normal' : `${speed}x`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMusicPlayer;