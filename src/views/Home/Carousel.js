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
  autoplaySpeed: 2000
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
    <section className="header bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-3" style={{ marginRight: '-15px' }}>
            <Menu />
          </div>
          <div className="col-md-9 px-0">

            <Slider  {...settings}>
              {banners.map((v, i) => {
                return (
                  <div key={i}>
                    <a href="# "><img src={v.b_image.url} className="img-fluid" style={{ height: '386px' }} width="900px" alt="First slide" /></a>
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
