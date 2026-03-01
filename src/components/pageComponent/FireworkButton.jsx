import React from 'react';
import CelebrationIcon from '@mui/icons-material/Celebration';

export const FireworkButton = () => {
  const handleLaunch = () => {
    if (window.manualLaunch) {
      window.manualLaunch();
    }
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '120px',
    right: '25px',
    width: '70px',
    height: '70px',
    borderRadius: '4px',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    zIndex: 100000,
    fontSize: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleLaunch}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <CelebrationIcon sx={{ fontSize: 30, color: '#fff' }} />
    </button>
  );
};