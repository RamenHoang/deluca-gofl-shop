import React, { useEffect } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';
import CartEmpty from './CartEmpty';
import CartExists from './CartExists';

const Cart = (props) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let removeCart = (childData) => {
    props.totalItem(childData);
  }

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item active"><a href="# ">Giỏ hàng</a></li>
          </ol>
        </div>
      </section>
      <section className="content">
        <div className="container">
          <div className="cart-page bg-white">
            <div className="row">
              {localStorage.getItem('cart') ? (<CartExists callBackUpdateCart={removeCart} />) : (<CartEmpty />)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Cart;
