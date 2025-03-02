import React, { useEffect, useState } from 'react';
import Menu from '../../components/Menu/Menu';
import homeAPI from '../../apis/homeAPI';
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  pauseOnHover: true,
};

const Carousel = () => {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    homeAPI.getBanners().then((res) => {
      setBanners(res.data.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <section className="header">
      <div className="container">
        <div className="row">
          {/* <div className="col-md-3" style={{ marginRight: '-15px' }}>
            <Menu />
          </div> */}
          <div className="col-md-12 px-0">
            <Slider  {...settings}>
              {banners.map((v, i) => {
                return (
                  <div key={i} style={{ overflow: "hidden" }}>
                    <a href="# "><img src={v.b_image.url} className="img-fluid" style={{ maxHeight: "600px" }} width="100%" alt="First slide" /></a>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Carousel;
