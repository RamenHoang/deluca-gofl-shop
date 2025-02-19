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
import xuatbantre from "../../assets/images/xuatbantre.png";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Carousel />
      <BestSeller />
      <NewBook />
      <BookHot />
      <section className="_1khoi sachnendoc bg-white mt-4">
        <div className="container">
          <div className="noidung" style={{ width: "100%" }}>
            <div className="row">
              {/*header*/}
              <div className="col-12 d-flex justify-content-between align-items-center pb-2 bg-transparent pt-4">
                <h2
                  className="header text-uppercase"
                  style={{ fontWeight: 400 }}
                >
                  NHÀ XUẤT BẢN
                </h2>
              </div>

              {/* 1 san pham */}
              <div className="col-lg col-sm-3">
                <div className="card">
                  <img
                    className="card-img-top anh"
                    src={kimdongLogo}
                    alt="logo kim dong"
                    style={{ height: "201px", width: "201px" }}
                  />
                </div>
              </div>

              <div className="col-lg col-sm-3">
                <div className="card">
                  <img
                    className="card-img-top anh"
                    src={nhanam}
                    alt="logo kim dong"
                    style={{ height: "201px", width: "201px" }}
                  />
                </div>
              </div>
              <div className="col-lg col-sm-3">
                <div className="card">
                  <img
                    className="card-img-top anh"
                    src={quocgiaLogo}
                    alt="logo kim dong"
                    style={{ height: "201px", width: "201px" }}
                  />
                </div>
              </div>

              <div className="col-lg col-sm-3">
                <div className="card">
                  <img
                    className="card-img-top anh"
                    src={donga}
                    alt="logo kim dong"
                    style={{ height: "201px", width: "201px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </section>
    </>
  );
};

export default Home;
