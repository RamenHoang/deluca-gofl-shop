import React from "react";

const FloatingIcons = () => {
  const iconStyle = {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1000
  };

  const buttonStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  const phoneStyle = {
    ...buttonStyle,
    backgroundColor: '#48D1CC'
  };

  const zaloStyle = {
    ...buttonStyle,
    backgroundColor: '#48D1CC'
  };

  return (
    <div style={iconStyle}>
      <a 
        href="tel:+84963958018" 
        style={phoneStyle}
        title="Call us"
      >
        <i className="fas fa-phone" style={{ color: 'white', fontSize: '14px' }}></i>
      </a>
      <a 
        href="https://zalo.me/+84963958018" 
        target="_blank" 
        rel="noopener noreferrer"
        style={zaloStyle}
        title="Chat with us on Zalo"
      >
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Zalo</span>
      </a>
    </div>
  );
};

export default FloatingIcons;
