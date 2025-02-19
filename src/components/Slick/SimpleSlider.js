import React from 'react';
import Slider from 'react-slick';
import ItemBook from '../ItemBook/ItemBook';

const SimpleSlider = ({ books }) => {
  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }
  return (
    <Slider {...settings}>
      { books.map((v, i) => {
        return (
          <ItemBook 
            key={i}
            info={v}
          />
        )
      })}
    </Slider>
  )
}

export default SimpleSlider
