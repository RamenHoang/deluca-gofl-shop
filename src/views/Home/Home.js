import React, { useEffect } from "react";
import Carousel from "./Carousel";
import NewBook from "./NewBook";
import "./Home.css";
import { useLocation, useHistory } from "react-router-dom";
import Information from "./Information";
import Menu from "../../components/Menu/Menu";
import DiscountProducts from "./DiscountProducts";
import { successToast } from "../../components/Toasts/Toasts";

// Floating icons component for contact options
const FloatingIcons = () => {
  const iconStyle = {
    position: 'fixed',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1000,
    top: '50%',
    transform: 'translateY(-50%)'
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

const Home = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);

    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get("message");
    if (message) {
      successToast(message);
      searchParams.delete("message");
      history.replace({ search: searchParams.toString() });
    }
  }, [location, history]);

  return (
    <>
      <Carousel />
      <Menu />
      <DiscountProducts />
      <NewBook />
      <Information />
      <FloatingIcons />
    </>
  );
};

export default Home;
