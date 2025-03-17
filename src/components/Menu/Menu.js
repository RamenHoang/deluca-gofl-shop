import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import './Menu.css';

const Menu = ({ categories }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="container mt-5 categories">
      {/* <div className="d-flex justify-content-start">
        <h2 className="title-1">Bắt đầu khám phá.</h2>
        <h2 className="title-2" style={{color: "#4B5563CC"}}>Những điều tuyệt vời đang chờ đón bạn.</h2>
      </div>
      <div className="categorycontent">
        <Slider {...settings}>
          {categories.map((v, i) => (
            <div className="category-item-container my-3" key={i}>
              <div className="category-item">
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <span className="category-name">{v.c_name}</span>
                    <br />
                    <span className="category-desciption" style={{color: "#3D3D3D"}} dangerouslySetInnerHTML={{ __html: v.c_description }} />
                  </div>
                  <Link to={`/categories?cateid=${v._id}&c_slug=${v.c_slug}`} className="category-link">
                    SHOP NOW →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div> */}
    </div>
  );
};

export default Menu;
