import React, { useState } from "react";
import { Link } from "react-router-dom";
import formatCurrency from "format-currency";
import Cart from "./../../utils/cart";
import { successToast } from "../Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const ItemCart = ({ info, callBackRemoveCart, callBackUpdateCart }) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [valueItem, setValueItem] = useState(info.quantity);

  let handleIncreaseItem = () => {
    let item = valueItem + 1;
    setValueItem(item);

    let oldCart = JSON.parse(localStorage.getItem("cart"));
    let newCart = new Cart(oldCart ? oldCart : null);
    showLoader();
    newCart.updateCartById(info.productInfo._id, item);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(newCart));
    hideLoader();

    successToast("Cập nhật giỏ hàng thành công !");

    let totalPrice = JSON.parse(localStorage.getItem("cart")).totalPrice;
    let totalQuantity = JSON.parse(localStorage.getItem("cart")).totalQuantity;
    let totalPriceDiscount = JSON.parse(
      localStorage.getItem("cart")
    ).totalPriceDiscount;

    callBackUpdateCart({
      totalPrice: totalPrice,
      totalQuantity: totalQuantity,
      totalPriceDiscount: totalPriceDiscount,
    });
  };

  let handleDecreaseItem = () => {
    if (valueItem <= 1) {
      return;
    } else {
      let item = valueItem - 1;
      setValueItem(item);
      let oldCart = JSON.parse(localStorage.getItem("cart"));
      let newCart = new Cart(oldCart ? oldCart : null);
      showLoader();
      newCart.updateCartById(info.productInfo._id, item);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(newCart));
      hideLoader();
      successToast("Cập nhật giỏ hàng thành công !");
      let totalPrice = JSON.parse(localStorage.getItem("cart")).totalPrice;
      let totalQuantity = JSON.parse(
        localStorage.getItem("cart")
      ).totalQuantity;
      let totalPriceDiscount = JSON.parse(
        localStorage.getItem("cart")
      ).totalPriceDiscount;

      callBackUpdateCart({
        totalPrice: totalPrice,
        totalQuantity: totalQuantity,
        totalPriceDiscount: totalPriceDiscount,
      });
    }
  };

  let handleChangeItem = (e) => {
    setValueItem(e.target.value);
  };

  let removeItemFromCart = () => {
    let oldCart = JSON.parse(localStorage.getItem("cart"));
    let newCart = new Cart(oldCart ? oldCart : null);
    newCart.removeItemCart(info.productInfo._id);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(newCart));
    let total = JSON.parse(localStorage.getItem("cart")).totalQuantity;
    callBackRemoveCart(total, info.productInfo._id);
    successToast("Xóa sản phẩm khỏi giỏ hàng thành công !");
  };

  return (
    <>
      <div className="cart-item d-flex">
        <a href="product-item.html" className="img">
          <img
            src={
              info.productInfo.p_image_detail?.url ||
              "/assets/images/dai-dich-tren-con-duong-to-lua.jpg"
            }
            className="img-fluid"
            alt="anhsp1"
          />
        </a>
        <div className="item-caption d-flex w-100">
          <div className="item-info ml-3" style={{ width: "500px" }}>
            <Link
              to={`/categories/${info.productInfo.category?.c_slug}.html?pid=${info.productInfo?._id}&p_slug=${info.productInfo?.p_slug}`}
              className="ten"
            >
              {info.productInfo?.p_name}
            </Link>
            <div className="soluong d-flex">
              <div className="input-number input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text btn-spin"
                    onClick={handleDecreaseItem}
                  >
                    -
                  </span>
                </div>
                <input
                  type="text"
                  className="soluongsp text-center"
                  value={valueItem}
                  onChange={handleChangeItem}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text btn-spin"
                    onClick={handleIncreaseItem}
                  >
                    +
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="item-price ml-auto d-flex flex-column align-items-end">
            <div className="giamoi">
              {formatCurrency(info.productInfo?.p_promotion)} ₫
            </div>
            <div className="giacu">
              {formatCurrency(info.productInfo?.p_price)} ₫
            </div>
            <span className="remove mt-auto">
              <i className="far fa-trash-alt" onClick={removeItemFromCart} />
            </span>
          </div>
        </div>
      </div>
      <hr />
      {loader}
    </>
  );
};

export default ItemCart;
