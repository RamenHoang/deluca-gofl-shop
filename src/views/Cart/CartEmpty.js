import React from 'react';
import { Link } from 'react-router-dom';
import image from './../../assets/images/shopping-cart-not-product.png';

const CartEmpty = () => {
  return (
    <div className="col-12 cart-empty">
      <div className="py-3 pl-3">
        <h6 className="header-gio-hang">GIỎ HÀNG CỦA BẠN <span>(0 sản phẩm)</span></h6>
        <div className="cart-empty-content w-100 text-center justify-content-center">
          <img src={image} alt="shopping-cart-not-product" />
          <p>Chưa có sản phẩm nào trong giở hàng của bạn</p>
          <Link to="/" className="btn nutmuathem mb-3">Mua thêm</Link>
        </div>
      </div>
    </div>
  )
}

export default CartEmpty;
