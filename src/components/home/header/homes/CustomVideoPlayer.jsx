import React, { useEffect, useRef, useState } from 'react';
import './CustomVideoPlayer.css';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';
import RepeatIcon from '@mui/icons-material/Repeat';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CustomVideoPlayer = ({ src, captionSrc }) => {
  const videoRef = useRef(null);
  const settingsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setHasStarted(false);
  }, [src]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => {
      if (hasStarted && video.readyState < 3) {
        setLoading(true);
      }
    };
    const onCanPlay = () => {
      if (hasStarted) setLoading(false);
    };
    const onSeeking = () => {
      if (hasStarted) setLoading(true);
    };
    const onSeeked = () => {
      if (hasStarted) setLoading(false);
    };
    const onPlaying = () => {
      setLoading(false);
      setHasStarted(true);
    };

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('playing', onPlaying);

    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('playing', onPlaying);
    };
  }, [src, hasStarted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 0;
    video.muted = true;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsPlaying(!video.paused);
    };

    const onTimeUpdate = () => setCurrentTime(video.currentTime);

    const onEnded = () => {
      if (!isLooping) {
        video.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(false);
        setShowControls(true);
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('playing', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    handleInteraction();

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [src, isLooping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowSettings(false);
    }, 6000);
  };

  const handleVideoClick = (e) => {
    if (!showControls) {
      handleInteraction();
    } else {
      const video = videoRef.current;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      handleInteraction();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);

    const newVolume = video.muted ? 0 : (volume === 0 ? 1 : volume);
    setVolume(newVolume);
    video.volume = newVolume;

    handleInteraction();
  };

  const toggleLoop = (e) => {
    e.stopPropagation();
    setIsLooping(!isLooping);
    handleInteraction();
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) container.requestFullscreen();
    else document.exitFullscreen();
    handleInteraction();
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    handleInteraction();
  };

  const displayTime = duration - currentTime < 0.1 ? duration : currentTime;
  let progressPercent = (displayTime / duration) * 100 || 0;
  if (progressPercent > 99.6) progressPercent = 100;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="video-player-container">
      <div className="video-container" onClick={handleVideoClick} onMouseMove={handleInteraction}>
        <video
          ref={videoRef}
          className="video"
          playsInline
          autoPlay
          muted={isMuted}
          src={src}
          loop={isLooping}
          preload="auto"
        >
          {captionSrc && (
            <track
              src={captionSrc}
              kind="subtitles"
              srcLang="en"
              label="English"
            />
          )}
        </video>
        {loading && <div className="loading-spinner"></div>}
        <div className={`controls ${showControls ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="progress-wrapper">
            <input
              type="range"
              className="progress-slider"
              min="0"
              max={duration || 0}
              step="0.01"
              value={displayTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                videoRef.current.currentTime = time;
                setCurrentTime(time);
              }}
              style={{
                background: `linear-gradient(to right, var(--primary-color) ${progressPercent}%, rgba(255, 255, 255, 0.3) ${progressPercent}%)`
              }}
            />
          </div>

          <div className="buttons-container">
            <div className="left-controls">
              <button className="control-btn" onClick={handleVideoClick}>
                {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
              </button>

              <button
                className={`control-btn repeat-btn-video ${isLooping ? 'active' : ''}`}
                onClick={toggleLoop}
                style={{ color: isLooping ? 'var(--primary-color)' : 'inherit' }}
              >
                <RepeatIcon fontSize="small" />
              </button>

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
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    videoRef.current.volume = vol;
                    setVolume(vol);
                    setIsMuted(vol === 0);
                    videoRef.current.muted = vol === 0;
                  }}
                  style={{
                    background: `linear-gradient(to right, var(--primary-color) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%)`
                  }}
                />
              </div>
              <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <div className="right-controls">
              <button className={`control-btn ${isCaptionsOn ? 'active' : ''}`} onClick={(e) => {
                const tracks = videoRef.current.textTracks;
                if (tracks && tracks.length > 0) {
                  const track = tracks[0];
                  const isShowing = track.mode === 'showing';

                  track.mode = isShowing ? 'hidden' : 'showing';
                  setIsCaptionsOn(!isShowing);
                }
              }}>CC</button>
              <div className="settings-menu" ref={settingsRef}>
                <button className="control-btn" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
                  <SettingsIcon fontSize="small" />
                </button>
                {showSettings && (
                  <div className="settings-content">
                    {[0.125, 0.25, 0.5, 1, 1.5, 2, 4].map((speed) => (
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