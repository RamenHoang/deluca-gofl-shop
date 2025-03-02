import React, { useEffect } from "react";
import Carousel from "./Carousel";
import NewBook from "./NewBook";
import "./Home.css";
import BookHot from "./BookHot";
import BestSeller from "./BestSeller";
import kimdongLogo from "../../assets/images/kimdong-logo.png";
import nhanam from "../../assets/images/nhanam.jpg";
import quocgiaLogo from "../../assets/images/qg-logo.png";
import donga from "../../assets/images/donga.png";
import Information from "./Information"; // Import the new Information component
import Menu from "../../components/Menu/Menu";
import DiscountProducts from "./DiscountProducts"; // Import the new DiscountProducts component

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Carousel />
      <Information />
      <Menu />
      <DiscountProducts />
      {/* <BestSeller /> */}
      <NewBook />
      {/* <BookHot /> */}
    </>
  );
};

export default Home;
