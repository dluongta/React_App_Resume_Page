// import React, { useEffect, useRef, useState } from 'react';
// import './CustomVideoPlayer.css';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
// import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import SettingsIcon from '@mui/icons-material/Settings';

// const formatTime = (seconds) => {
//   if (isNaN(seconds)) return '00:00:00';
//   const hours = Math.floor(seconds / 3600);
//   seconds %= 3600;
//   const minutes = Math.floor(seconds / 60);
//   seconds = Math.floor(seconds % 60);
//   return `${hours.toString().padStart(2, '0')}:${minutes
//     .toString()
//     .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// };

// const CustomVideoPlayer = ({ src, captionSrc }) => {
//   const videoRef = useRef(null);
//   const progressBarRef = useRef(null);
//   const settingsRef = useRef(null);
//   const controlsTimeoutRef = useRef(null);

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [volume, setVolume] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isCaptionsOn, setIsCaptionsOn] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [showSettings, setShowSettings] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [previewTime, setPreviewTime] = useState(null);
//   const [previewPos, setPreviewPos] = useState(null);
//   const [showControls, setShowControls] = useState(true);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.volume = 1;
//     video.muted = true;

//     const onLoadedMetadata = () => {
//       setDuration(video.duration);
//       setIsPlaying(!video.paused);
//       const track = video.textTracks[0];
//       if (track) {
//         track.mode = 'hidden';
//         setIsCaptionsOn(false);
//       }
//       handleInteraction();
//     };

//     const onTimeUpdate = () => {
//       const video = videoRef.current;
//       if (!video) return;

//       let time = video.currentTime;

//       if (video.duration - time < 0.25) {
//         time = video.duration;
//       }

//       setCurrentTime(time);

//       if (progressBarRef.current) {
//         const percent = (time / video.duration) * 100;
//         progressBarRef.current.style.width = `${percent}%`;
//       }
//     };

//     const onEnded = () => {
//       const video = videoRef.current;
//       if (!video) return;
//       setCurrentTime(video.duration);
//     };
//     // const onWaiting = () => setLoading(true);
//     // const onWaiting = () => {
//     //   if (videoRef.current.currentTime > 0) {
//     //     setLoading(true);
//     //   }
//     // }; 
//     const onWaiting = () => {};
//     const onPlaying = () => {
//       setLoading(false);
//       setIsPlaying(true);
//     };
//     const onPause = () => setIsPlaying(false);

//     video.addEventListener('loadedmetadata', onLoadedMetadata);
//     video.addEventListener('timeupdate', onTimeUpdate);
//     video.addEventListener('ended', onEnded);
//     video.addEventListener('waiting', onWaiting);
//     video.addEventListener('playing', onPlaying);
//     video.addEventListener('pause', onPause);

//     return () => {
//       video.removeEventListener('loadedmetadata', onLoadedMetadata);
//       video.removeEventListener('timeupdate', onTimeUpdate);
//       video.removeEventListener('ended', onEnded);
//       video.removeEventListener('waiting', onWaiting);
//       video.removeEventListener('playing', onPlaying);
//       video.removeEventListener('pause', onPause);
//       if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
//     };
//   }, [src, captionSrc]);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(Boolean(document.fullscreenElement));
//     };
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (settingsRef.current && !settingsRef.current.contains(event.target)) {
//         setShowSettings(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleInteraction = () => {
//     setShowControls(true);
//     if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

//     controlsTimeoutRef.current = setTimeout(() => {
//       if (videoRef.current && !videoRef.current.paused) {
//         setShowControls(false);
//         setShowSettings(false);
//       }
//     }, 3000);
//   };

//   const handleOverlayTouch = (e) => {
//     e.stopPropagation();
//     handleInteraction();
//   };

//   const togglePlay = (e) => {
//     if (e) e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;

//     if (video.paused) {
//       video.play().catch(console.error);
//       handleInteraction();
//     } else {
//       video.pause();
//       setShowControls(true);
//       if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
//     }
//   };

//   const toggleMute = (e) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = !video.muted;
//     setIsMuted(video.muted);
//     setVolume(video.muted ? 0 : video.volume);
//     handleInteraction();
//   };

//   const handleVolumeChange = (e) => {
//     e.stopPropagation();

//     const video = videoRef.current;
//     if (!video) return;

//     const vol = parseFloat(e.target.value);
//     video.volume = vol;
//     setVolume(vol);

//     if (vol === 0) {
//       setIsMuted(true);
//       video.muted = true;
//     } else {
//       setIsMuted(false);
//       video.muted = false;
//     }

//     handleInteraction();
//   };

//   const handleProgressClick = (e) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const clickX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
//     video.currentTime = (clickX / rect.width) * video.duration;
//     handleInteraction();
//   };

//   const toggleFullscreen = (e) => {
//     e.stopPropagation();
//     const container = videoRef.current.parentElement;
//     if (!document.fullscreenElement) container.requestFullscreen().catch(console.error);
//     else document.exitFullscreen().catch(console.error);
//     handleInteraction();
//   };

//   const toggleCaptions = (e) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;
//     const track = video.textTracks[0];
//     if (!track) return;
//     track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
//     setIsCaptionsOn(track.mode === 'showing');
//     handleInteraction();
//   };

//   const changePlaybackRate = (rate) => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.playbackRate = rate;
//     setPlaybackRate(rate);
//     setShowSettings(false);
//     handleInteraction();
//   };

//   const safeTime = duration - currentTime < 0.2 ? duration : currentTime;

//   const progressPercent = Math.min((safeTime / duration) * 100 || 0, 100);

//   return (
//     <div className="video-player-container">
//       <div className="video-container" onMouseMove={handleInteraction}>
//         <video
//           ref={videoRef}
//           className="video"
//           playsInline
//           autoPlay
//           muted={isMuted}
//           src={src}
//           loop
//           onClick={showControls ? togglePlay : undefined}
//         >
//           {captionSrc && (
//             <track src={captionSrc} kind="subtitles" srcLang="en" label="English" default />
//           )}
//         </video>

//         {!showControls && (
//           <div className="mobile-touch-layer" onClick={handleOverlayTouch}></div>
//         )}
//         {/* {loading && <div className="loading-spinner"></div>} */}
//         <div className={`controls ${showControls ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
//           <div className="progress-wrapper">
//             <input
//               type="range"
//               className="progress-slider"
//               min="0"
//               max={duration || 0}
//               step="0.1"
//               value={safeTime}
//               onChange={(e) => {
//                 const time = parseFloat(e.target.value);
//                 videoRef.current.currentTime = time;
//                 setCurrentTime(time);
//               }}
//               style={{
//                 background: `linear-gradient(to right, var(--primary-color) ${progressPercent}%, rgba(255, 255, 255, 0.3) ${progressPercent}%)`,
//               }}
//             />
//           </div>

//           <div className="buttons-container">
//             <div className="left-controls">
//               <button className="control-btn" onClick={togglePlay}>
//                 {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
//               </button>

//               <div className="volume-container">
//                 <button className="control-btn" onClick={toggleMute}>
//                   {isMuted || volume === 0 ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
//                 </button>
//                 <input
//                   type="range"
//                   className="volume-slider"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   value={isMuted ? 0 : volume}
//                   onChange={handleVolumeChange}
//                   style={{
//                     background: `linear-gradient(to right, var(--primary-color) ${(isMuted ? 0 : volume) * 100
//                       }%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%)`,
//                   }}
//                 />
//               </div>

//               <span className="time-display">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>
//             <div className="right-controls">
//               <button className={`control-btn ${isCaptionsOn ? 'active' : ''}`} onClick={toggleCaptions}>CC</button>
//               <div className="settings-menu" ref={settingsRef}>
//                 <button className="control-btn" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
//                   <SettingsIcon fontSize="small" />
//                 </button>
//                 {showSettings && (
//                   <div className="settings-content">
//                     {[0.0625, 0.125, 0.25, 0.5, 1, 1.5, 2, 4, 8].map((speed) => (
//                       <div key={speed} className={`settings-item ${playbackRate === speed ? 'active' : ''}`} onClick={() => changePlaybackRate(speed)}>
//                         {speed === 1 ? 'Normal' : `${speed}x`}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <button className="control-btn" onClick={toggleFullscreen}>
//                 {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomVideoPlayer;
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
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

    // const onWaiting = () => setLoading(true);
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
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);
    // video.addEventListener('playing', () => setLoading(false));
    const onPlaying = () => {
      setLoading(false);
      setHasStarted(true);
    };

    video.addEventListener('playing', onPlaying);
    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('playing', onPlaying);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = 1;
    video.muted = true;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsPlaying(!video.paused);
    };

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onEnded = () => {
      setCurrentTime(video.duration);
      setIsPlaying(false);
      setShowControls(true);
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
  }, [src]);

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowSettings(false);
    }, 5000);
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
    setVolume(video.muted ? 0 : video.volume);
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
          loop
          preload="auto"
        />
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
                const track = videoRef.current.textTracks[0];
                if (track) {
                  track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
                  setIsCaptionsOn(track.mode === 'showing');
                }
              }}>CC</button>
              <div className="settings-menu" ref={settingsRef}>
                <button className="control-btn" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
                  <SettingsIcon fontSize="small" />
                </button>
                {showSettings && (
                  <div className="settings-content">
                    {[0.0625, 0.125, 0.25, 0.5, 1, 1.5, 2, 4, 8, 16].map((speed) => (
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