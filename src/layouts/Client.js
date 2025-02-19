import React, { useEffect, useState } from "react";
import BackToTop from "../components/BackToTop/BackToTop";
import FooterBottom from "../components/Footer/FooterBottom";
import FooterTop from "../components/Footer/FooterTop";
import HeaderBottom from "../components/Header/HeaderBottom";
import HeaderBottomWithMenu from "../components/Header/HeaderBottomWithMenu";
import HeaderTop from "../components/Header/HeaderTop";
import Login from "../components/Modal/Login";
import Register from "../components/Modal/Register";
// import MessengerCustomerChat from 'react-messenger-customer-chat';

const Client = (props) => {
  const [isUrl, setIsUrl] = useState("/");
  useEffect(() => {
    setIsUrl(props.match.url);
  }, [props.match]);

  return (
    <>
      <HeaderTop totalItem={props.cntItem} />
      {isUrl === "/" ? <HeaderBottom /> : <HeaderBottomWithMenu />}
      {props.children}
      <FooterTop />
      <FooterBottom />
      <BackToTop />
      <Login />
      <Register />
      {/* <MessengerCustomerChat 
        pageId="107432951513144"
        appId="317532176245919"
      /> */}
    </>
  );
};

export default Client;
