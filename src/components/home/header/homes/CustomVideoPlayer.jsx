import React, { useEffect, useRef, useState } from 'react';
import './CustomVideoPlayer.css';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const CustomVideoPlayer = ({ src, captionSrc }) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const settingsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewTime, setPreviewTime] = useState(null);
  const [previewPos, setPreviewPos] = useState(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1;
    video.muted = true;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsPlaying(!video.paused);
      const track = video.textTracks[0];
      if (track) {
        track.mode = 'hidden';
        setIsCaptionsOn(false);
      }
      handleInteraction();
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (progressBarRef.current) {
        const percent = (video.currentTime / video.duration) * 100;
        progressBarRef.current.style.width = `${percent}%`;
      }
    };

    const onWaiting = () => setLoading(true);
    const onPlaying = () => {
      setLoading(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [src, captionSrc]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  };

  // Hàm quan trọng: Chỉ bật controls nếu đang ẩn
  const handleOverlayTouch = (e) => {
    e.stopPropagation();
    handleInteraction();
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
      handleInteraction();
    } else {
      video.pause();
      setShowControls(true); // Luôn hiện khi pause
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    setVolume(video.muted ? 0 : video.volume);
    handleInteraction();
  };

  // const handleVolumeChange = (e) => {
  //   e.stopPropagation();
  //   const video = videoRef.current;
  //   if (!video) return;
  //   const vol = parseFloat(e.target.value);
  //   video.volume = vol;
  //   video.muted = vol === 0;
  //   setVolume(vol);
  //   setIsMuted(video.muted);
  //   handleInteraction();
  // };
  const handleVolumeChange = (e) => {
    e.stopPropagation(); 
    
    const video = videoRef.current;
    if (!video) return;
    
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    
    if (vol === 0) {
        setIsMuted(true);
        video.muted = true;
    } else {
        setIsMuted(false);
        video.muted = false;
    }
    
    handleInteraction(); 
};

  const handleProgressClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    video.currentTime = (clickX / rect.width) * video.duration;
    handleInteraction();
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) container.requestFullscreen().catch(console.error);
    else document.exitFullscreen().catch(console.error);
    handleInteraction();
  };

  const toggleCaptions = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const track = video.textTracks[0];
    if (!track) return;
    track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
    setIsCaptionsOn(track.mode === 'showing');
    handleInteraction();
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    handleInteraction();
  };

  return (
    <div className="video-player-container">
      <div
        className="video-container"
        onMouseMove={handleInteraction}
      >
        <video
          ref={videoRef}
          className="video"
          playsInline
          autoPlay
          muted={isMuted}
          src={src}
          loop
          onClick={showControls ? togglePlay : undefined} // Chỉ cho phép click video khi controls đang hiện
        >
          {captionSrc && (
            <track src={captionSrc} kind="subtitles" srcLang="en" label="English" default />
          )}
        </video>

        {/* LỚP PHỦ MOBILE: Khi controls ẨN, lớp này hiện lên chặn click vào video */}
        {!showControls && (
          <div className="mobile-touch-layer" onClick={handleOverlayTouch}></div>
        )}

        {loading && <div className="loading-spinner"></div>}

        <div className={`controls ${showControls ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
{/* Thay thế đoạn cũ bằng đoạn này */}
<div className="progress-wrapper">
  <input
    type="range"
    className="progress-slider"
    min="0"
    max={duration || 0}
    step="0.1"
    value={currentTime}
    onChange={(e) => {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }}
    style={{
      background: `linear-gradient(to right, var(--primary-color) ${
        (currentTime / duration) * 100 || 0
      }%, rgba(255, 255, 255, 0.3) ${(currentTime / duration) * 100 || 0}%)`,
    }}
  />
</div>

          <div className="buttons-container">
<div className="left-controls">
  <button className="control-btn" onClick={togglePlay}>
    {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
  </button>
  
  {/* --- PHẦN VOLUME ĐÃ CẬP NHẬT --- */}
  <div className="volume-container">
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
    background: `linear-gradient(to right, var(--primary-color) ${
      (isMuted ? 0 : volume) * 100
    }%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%)`,
  }}
/>
  </div>
  {/* ------------------------------ */}

  <span className="time-display">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>
</div>
            <div className="right-controls">
              <button className={`control-btn ${isCaptionsOn ? 'active' : ''}`} onClick={toggleCaptions}>CC</button>
              <div className="settings-menu" ref={settingsRef}>
                <button className="control-btn" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
                  <SettingsIcon fontSize="small" />
                </button>
                {showSettings && (
                  <div className="settings-content">
                    {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                      <div key={speed} className={`settings-item ${playbackRate === speed ? 'active' : ''}`} onClick={() => changePlaybackRate(speed)}>
                        {speed === 1 ? 'Normal' : `${speed}x`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="control-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;