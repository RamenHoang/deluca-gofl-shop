import React from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from 'format-currency';
import discountIcon from '../../assets/images/discount-icon.png';
import './ItemBook.css';

const ItemBook = ({ info }) => {
  return (
    <div className="card" style={{ border: "none", position: "relative" }}>
      {info.p_promotion > 0 && (
        <div className='product-item-discount'>
          <img src={discountIcon} alt="Discount Icon" style={{ marginRight: "5px", width: "13px", height: "13px" }} />
          {Math.round(((info.p_price - info.p_promotion) / info.p_price) * 100)}% Discount
        </div>
      )}
      <Link to={`/categories/${info.category.c_slug}.html?pid=${info._id}&p_slug=${info.p_slug}`} className="motsanpham" style={{ textDecoration: 'none', color: 'black' }} data-toggle="tooltip" data-placement="bottom" title={info.p_name}>
        <img className="card-img-top anh" src={info.variants[0].image.url} alt="item book" />
        <div className="card-body noidungsp mt-3">
          <h3 className="card-title ten">{info.p_name}</h3>
          <div className="gia d-flex justify-content-between">
            <div className="product-item-category">
              {info.category.c_name}
              <div className="danhgia">
                <ul className="d-flex" style={{ listStyle: "none" }}>
                  <i className="fa fa-star" style={{ color: "#FBBF24", fontSize: "12px", lineHeight: "1.5" }} />
                  <span style={{ fontSize: "12px", color: "#4B5563" }}>
                    &nbsp;{info.rating}&nbsp;({info.number_of_rating})
                  </span>
                </ul>
              </div>
            </div>
            <div>
              <div className="giamoi">{formatCurrency(info.p_promotion > 0 ? info.p_promotion : info.p_price)} ₫</div>
              {info.p_promotion > 0 && (<div className="giacu">{formatCurrency(info.p_price)} ₫</div>)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ItemBook
