import React, { useEffect } from "react";
import Carousel from "./Carousel";
import NewBook from "./NewBook";
import "./Home.css";
import { useLocation, useHistory } from "react-router-dom";
import Information from "./Information";
import Menu from "../../components/Menu/Menu";
import DiscountProducts from "./DiscountProducts";
import { successToast } from "../../components/Toasts/Toasts";

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
    </>
  );
};

export default Home;
