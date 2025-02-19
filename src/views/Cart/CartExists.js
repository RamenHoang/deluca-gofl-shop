import React, { useEffect, useState } from 'react';
import ItemCart from './../../components/ItemCart/ItemCart';
import { Link } from 'react-router-dom';
import formatCurrency from 'format-currency';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import getCookie from '../../utils/getCookie';
import userAPI from './../../apis/userAPI';
import iconPayCash from './../../assets/images/icon-payment-cash.svg';
import iconPayATM from './../../assets/images/icon-payment-atm.svg';
import useFullPageLoader from '../../hooks/useFullPageLoader';
import orderAPI from '../../apis/orderAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';

const token = getCookie('authUserToken');

const CartExists = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceDiscount, setTotalPriceDiscount] = useState(0);
  const [items, setItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(15000);
  const [user, setUser] = useState({});

  useEffect(() => {
    setTotalPrice(JSON.parse(localStorage.getItem('cart')).totalPrice);
    setItems(Object.values(JSON.parse(localStorage.getItem('cart')).products));
    setTotalPriceDiscount(JSON.parse(localStorage.getItem('cart')).totalPriceDiscount);
    //api get user

    if (getCookie('currentUserId')) {
      userAPI.getUserById(getCookie('currentUserId')).then((res) => {
        setUser(res.data.data);
      }).catch(err => {
        console.log(err);
      });
    }

  }, []);

  //Remove cart
  let removeCart = (childData, id) => {
    props.callBackUpdateCart(childData);

    setTotalPrice(JSON.parse(localStorage.getItem('cart')).totalPrice);
    setTotalPriceDiscount(JSON.parse(localStorage.getItem('cart')).totalPriceDiscount);

    let newItem = items.filter(v => v.productInfo._id !== id);
    setItems([...newItem]);

    if (JSON.parse(localStorage.getItem('cart')).totalQuantity === 0) {
      localStorage.removeItem('cart');
    }
  }

  let updateCart = (childData) => {
    setTotalPrice(childData.totalPrice);
    setTotalPriceDiscount(childData.totalPriceDiscount);
    props.callBackUpdateCart(childData.totalQuantity);
  }

  let handleChangeDelivery = (e) => {
    let data = {
      method: e.target.value
    }
    showLoader();
    orderAPI.calculateShippingFee(data).then(res => {
      setShippingFee(res.data);
      hideLoader();
    }).catch(err => {
      console.log(err);
      hideLoader();
    });
  }

  let orderFormik = useFormik({
    initialValues: {
      inputUsername: user.username,
      inputAddress: user.address ? user.address : '',
      inputPhoneNumber: user.phone ? user.phone : '',
      inputPayment: 'pay-cash',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputAddress: Yup.string()
        .required("Bắt buộc nhập địa chỉ"),
      inputPhoneNumber: Yup.string()
        .required("Bắt buộc nhập số điện thoại")
    }),
    onSubmit: (values) => {
      let data = {
        o_shippingAddress: values.inputAddress,
        o_phoneReceiver: values.inputPhoneNumber,
        o_nameReceiver: values.inputUsername,
        o_shippingFee: shippingFee,
        o_payment: values.inputPayment,
        products: items,
        totalPrice: (totalPrice + shippingFee)
      };
      showLoader();
      orderAPI.addNewOrder(data).then(res => {
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Đặt hàng thành công, kiểm tra hóa đơn đã gửi vào email !");
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        if (res.data.message === 'FAILED') {
          hideLoader();
          errorToast("Có lỗi xảy ra, vui lòng thử lại !");
        }
      }).catch(err => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
    }
  });

  return (
    <>
      <div className="col-md-8 cart">
        <div className="cart-content py-3 pl-3">
          <h4 className="header-gio-hang">GIỎ HÀNG CỦA BẠN <span>( {JSON.parse(localStorage.getItem('cart')).totalQuantity} sản phẩm)</span></h4>

          <div className="cart-list-items">
            {
              items ? items.map((v, i) => {
                return (
                  <ItemCart
                    key={i}
                    info={v}
                    callBackRemoveCart={removeCart}
                    callBackUpdateCart={updateCart}
                  />
                )
              }) : ''
            }
          </div>

          <div className="row">
            <div className="col-md-5">
              <Link to="/" className="btn nutmuathem mb-3">Mua thêm</Link>
            </div>
           
            <div className="col-md-4 offset-md-3">
              <div className="tonggiatien">
                <div className="group d-flex justify-content-between">
                  <p className="label">Tạm tính:</p>
                  <p className="tamtinh">{formatCurrency(totalPrice)} ₫</p>
                </div>
                <div className="group d-flex justify-content-between">
                  <p className="label">Giảm giá:</p>
                  <p className="giamgia">{ formatCurrency(totalPriceDiscount) } ₫</p>
                </div>
                <div className="group d-flex justify-content-between">
                  <p className="label">Phí vận chuyển:</p>
                  <p className="phivanchuyen">{formatCurrency(shippingFee)} ₫</p>
                </div>
                <div className="group d-flex justify-content-between align-items-center">
                  <strong className="text-uppercase">Tổng cộng:</strong>
                  <p className="tongcong">{formatCurrency(totalPrice + shippingFee)} ₫</p>
                </div>
                <small className="note d-flex justify-content-end text-muted"> (Giá đã bao gồm VAT) </small>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="col-md-4 mt-3 cart-steps">

        {token === '' ? (
          <button className="btn btn-block nutdangnhap" data-toggle="modal" data-target="#formdangnhap" style={{ background: '#F5A623', color: 'white' }}>Tiến hành đặt hàng</button>
        ) : (

          <div id="cart-steps-accordion" role="tablist" aria-multiselectable="true">
            <form onSubmit={orderFormik.handleSubmit}>
              <div className="card">
                <div className="card-header" role="tab" id="step2header">
                  <h5 className="mb-0">
                    <a data-toggle="collapse" data-parent="#cart-steps-accordion" href="#step2contentid" aria-expanded="true" aria-controls="step2contentid" className="text-uppercase header">
                      <span className="steps">1</span>
                      <span className="label">Địa chỉ giao hàng</span>
                      <i className="fa fa-chevron-right float-right" />
                    </a>
                  </h5>
                </div>
                <div id="step2contentid" className="collapse in" role="tabpanel" aria-labelledby="step2header">
                  <div className="card-body">
                    <div className="form-diachigiaohang">

                      <h4>{user.username}</h4>

                      <hr />
                      <div className="form-group">
                        <label htmlFor="inputUsername">Người nhận (*)</label>
                        <input type="text" className="form-control" name="inputUsername"
                          value={orderFormik.values.inputUsername || ''}
                          onChange={orderFormik.handleChange}
                        />
                        { orderFormik.errors.inputUsername && orderFormik.touched.inputUsername && (
                          <small className="active-error" >{ orderFormik.errors.inputUsername }</small>
                        ) }
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputAddress">Địa chỉ nhận hàng (*)</label>
                        <input type="text" className="form-control" name="inputAddress"
                          value={orderFormik.values.inputAddress || ''}
                          onChange={orderFormik.handleChange}
                        />
                         { orderFormik.errors.inputAddress && orderFormik.touched.inputAddress && (
                          <small className="active-error" >{ orderFormik.errors.inputAddress }</small>
                        ) }
                      </div>

                      <div className="form-group">
                        <label htmlFor="inputPhoneNumber">Số điện thoại (*)</label>
                        <input type="text" className="form-control" name="inputPhoneNumber"
                          value={orderFormik.values.inputPhoneNumber || ''}
                          onChange={orderFormik.handleChange} 
                        />
                          { orderFormik.errors.inputPhoneNumber && orderFormik.touched.inputPhoneNumber && (
                          <small className="active-error" >{ orderFormik.errors.inputPhoneNumber }</small>
                        ) }
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="card">
                <div className="card-header" role="tab" id="step3header">
                  <h5 className="mb-0">
                    <a data-toggle="collapse" data-parent="#cart-steps-accordion" href="#step3contentid" aria-expanded="true" aria-controls="step3contentid" className="text-uppercase header">
                      <span className="steps">2</span>
                      <span className="label">Thanh toán đặt mua</span>
                      <i className="fa fa-chevron-right float-right" />
                    </a>
                  </h5>
                </div>
                <div id="step3contentid" className="collapse in" role="tabpanel" aria-labelledby="step3header">
                  <div className="card-body" style={{ padding: '15px' }}>

                    <div className="goigiaohang">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="inputDelivery" id="inputDeliveryBasic" 
                          value="delivery-basic" defaultChecked
                          onChange={handleChangeDelivery}
                        />
                        <label className="form-check-label" htmlFor="inputDeliveryBasic"> Giao hàng tiêu chuẩn</label>
                      </div>

                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="inputDelivery" id="inputDeliveryFast" 
                          value="delivery-fast"
                          onChange={handleChangeDelivery}
                        />
                        <label className="form-check-label" htmlFor="inputDeliveryFast">Giao hàng nhanh (2h - 3h)</label>
                      </div>
                    </div>

                    <hr />
                    <div className="pttt">
                      <h6 className="header text-uppercase">Chọn phương thức thanh toán</h6>

                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="payment" id="payCash" 
                          value="pay-cash"
                          checked={ orderFormik.values.inputPayment === "pay-cash" }
                          onChange={orderFormik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="payCash">
                          <img src={iconPayCash} alt="payment-cash" className="payment" />
                        Thanh toán tiền mặt khi nhận hàng
                      </label>
                      </div>

                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="payment" id="payATM" 
                          value="pay-atm" 
                          checked={ orderFormik.values.inputPayment === "pay-atm" }
                          onChange={orderFormik.handleChange}  
                        />
                        <label className="form-check-label" htmlFor="payATM">
                          <img src={iconPayATM} alt="payment-atm" className="payment" />
                        Thẻ ATM nội địa/Internet Banking (Miễn phí thanh toán) (<b>Định hướng phát triển</b>)
                      </label>
                      </div>

                    </div>
                    <hr />
                    <button type="submit" className="btn btn-lg btn-block btn-checkout text-uppercase text-white" style={{ background: '#F5A623' }}>Đặt mua</button>
                    <p className="text-center note-before-checkout">(Vui lòng kiểm tra lại đơn hàng trước khi Đặt Mua)</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      { loader}
    </>
  )
}

export default CartExists;
