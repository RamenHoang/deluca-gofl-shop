import React, { useEffect, useState } from 'react';
import homeAPI from './../../apis/homeAPI';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import './Menu.css';

const Menu = (props) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    homeAPI.getAllCategories().then((res) => {
      setCategories(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <h2>Bắt đầu khám phá.</h2>
        <h2 style={{color: "#4B5563CC"}}>&nbsp;Những điều tuyệt vời đang chờ đón bạn.</h2>
      </div>
      <div className="row categorycontent">
        <Slider {...settings}>
          {categories.map((v, i) => {
            return (
              <div className="category-item-container my-3">
                <div className="category-item">
                  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                      <span style={{fontSize: "1.5rem"}}>{v.c_name}</span>
                      <br></br>
                      <span style={{color: "#3D3D3D"}} dangerouslySetInnerHTML={{ __html: v.c_description }} />
                    </div>
                    <Link to={`/categories?cateid=${v._id}&c_slug=${v.c_slug}`} className="category-item-link" style={{fontSize: "14px"}}>
                      SHOP NOW →
                    </Link>
                  </div>
                </div>
                {/* <i className="fa fa-chevron-right float-right" /> */}
              </div>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default Menu;
