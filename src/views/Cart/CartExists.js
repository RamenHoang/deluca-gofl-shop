import React, { useEffect, useState } from 'react';
import ItemCart from './../../components/ItemCart/ItemCart';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import getCookie from '../../utils/getCookie';
import userAPI from './../../apis/userAPI';
import iconPayCash from './../../assets/images/icon-payment-cash.svg';
import iconPayATM from './../../assets/images/icon-payment-atm.svg';
import useFullPageLoader from '../../hooks/useFullPageLoader';
import orderAPI from '../../apis/orderAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import contactInforIcon from './../../assets/images/contact-infor-icon.png';
import shippingAddressIcon from './../../assets/images/shipping-address-icon.png';
import paymentIcon from './../../assets/images/payment-icon.png';
import homeAPI from '../../apis/homeAPI';

const token = getCookie('authUserToken');

const CartExists = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceDiscount, setTotalPriceDiscount] = useState(0);
  const [items, setItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(15000);
  const [user, setUser] = useState({});

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart) return;

    // Initialize state with cart data
    setTotalPrice(cart.totalPrice);
    setItems(Object.values(cart.products));
    setTotalPriceDiscount(cart.totalPriceDiscount);
    
    // Check stock for each product in cart
    const checkProductStock = async () => {
      let updatedCart = {...cart};
      let isCartChanged = false;
      const removedItems = [];
      
      for (const itemId in updatedCart.products) {
        try {
          // Get the latest product information
          const response = await homeAPI.getBookById(updatedCart.products[itemId].productInfo._id);
          const product = response.data.data;
          const variant = product.variants.find(v => v.color._id === updatedCart.products[itemId].variant.color._id);
          const size = variant.sizes.find(s => s.size._id === updatedCart.products[itemId].size.size._id);

          updatedCart.products[itemId].variant = variant;
          updatedCart.products[itemId].size = size;
          
          // Check if product is out of stock
          if (size.stock === 0) {
            // Remove product from cart
            delete updatedCart.products[itemId];
            isCartChanged = true;
          } else if (size.stock < updatedCart.products[itemId].quantity) {
            // If available stock is less than cart quantity, update the quantity
            updatedCart.products[itemId].quantity = size.stock;
            isCartChanged = true;
          }
          
          // Update product info with latest data
          if (updatedCart.products[itemId]) {
            updatedCart.products[itemId].productInfo = product;
          }
        } catch (err) {
          console.log(`Error checking product ${itemId}:`, err);
        }
      }
      
      // If cart was modified, update localStorage and state
      if (isCartChanged) {
        // Recalculate totals
        let totalPrice = 0;
        let totalQuantity = 0;
        let totalPriceDiscount = 0;
        
        Object.values(updatedCart.products).forEach(item => {
          totalPrice += (item.productInfo.p_promotion ? item.productInfo.p_promotion : item.productInfo.p_price) * item.quantity;
          totalQuantity += item.quantity;
          totalPriceDiscount += (item.productInfo.p_price - item.productInfo.p_promotion) * item.quantity;
        });
        
        updatedCart.totalPrice = totalPrice;
        updatedCart.totalQuantity = totalQuantity;
        updatedCart.totalPriceDiscount = totalPriceDiscount;
        
        // If cart is empty after removing items, remove it from localStorage
        if (totalQuantity === 0) {
          localStorage.removeItem('cart');
          window.location.href = '/cart'; // Redirect to cart page which will show empty cart
        } else {
          // Update localStorage with modified cart
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          
          // Update component state
          setTotalPrice(updatedCart.totalPrice);
          setTotalPriceDiscount(updatedCart.totalPriceDiscount);
          setItems(Object.values(updatedCart.products));
          
          // Update cart quantity in parent component
          props.callBackUpdateCart(updatedCart.totalQuantity);
        }
        
        // Notify about removed items
        if (removedItems.length > 0) {
          errorToast(`${removedItems.join(', ')} đã hết hàng và đã bị xóa khỏi giỏ hàng của bạn.`);
        }
      }
    };
    
    // Execute stock check
    checkProductStock();

    // Get user info
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
      inputPhone: user.phone ? user.phone : '',
      inputEmail: user.email ? user.email : '',
      inputFirstName: '',
      inputLastName: '',
      inputAddress1: '',
      inputHouseNumber: '',
      inputAddress2: '',
      inputCity: '',
      inputCountry: '',
      inputState: '',
      inputPostalcode: '',
      inputPayment: 'pay-cash',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputEmail: Yup.string()
        .required("Bắt buộc nhập địa chỉ"),
      inputPhone: Yup.string()
        .required("Bắt buộc nhập số điện thoại")
    }),
    onSubmit: (values) => {
      let data = {
        o_phone: values.inputPhone,
        o_email: values.inputEmail,
        o_firstName: values.inputFirstName,
        o_lastName: values.inputLastName,
        o_shippingAddress1: values.inputAddress1,
        o_shippingHouseNumber: values.inputHouseNumber,
        o_shippingAddress2: values.inputAddress2,
        o_shippingCity: values.inputCity,
        o_shippingCountry: values.inputCountry,
        o_shippingState: values.inputState,
        o_shippingPostalcode: values.inputPostalcode,
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
      <div className="col-md-6 mt-3 cart-steps">

        {token === '' ? (
          <button className="btn btn-block nutdangnhap" data-toggle="modal" data-target="#formdangnhap" style={{ background: '#F5A623', color: 'white' }}>Tiến hành đặt hàng</button>
        ) : (

          <div id="cart-steps-accordion" role="tablist" aria-multiselectable="true">
            <form onSubmit={orderFormik.handleSubmit} name="orderForm">
              <div className="card" style={{ borderRadius: "12px" }}>
                <div id="step2contentid" className="collapse in show" role="tabpanel" aria-labelledby="step2header">
                  <div className="card-body" style={{ padding: '0' }}>
                    <div className="form-diachigiaohang">
                      <div className="col-12 mt-3">
                        <img src={contactInforIcon} alt="contact-infor-icon" style={{ width: "16px", height: "16px" }} />
                        <span style={{ fontSize: "16px" }} className="ml-1">Thông tin liên hệ</span>
                      </div>
                      <hr />
                      <div className="d-flex">
                        <div className="form-group col-6">
                          <label htmlFor="inputPhone">Số điện thoại</label>
                          <input type="text" className="form-control" name="inputPhone" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputPhone || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputPhone && orderFormik.touched.inputPhone && (
                            <small className="active-error" >{orderFormik.errors.inputPhone}</small>
                          )}
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="inputEmail">Email</label>
                          <input type="text" className="form-control" name="inputEmail" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputEmail || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputEmail && orderFormik.touched.inputEmail && (
                            <small className="active-error" >{orderFormik.errors.inputEmail}</small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-3" style={{ borderRadius: "12px" }}>
                <div id="step2contentid" className="collapse in show" role="tabpanel" aria-labelledby="step2header">
                  <div className="card-body" style={{ padding: '0' }}>
                    <div className="form-diachigiaohang">
                      <div className="col-12 mt-3">
                        <img src={shippingAddressIcon} alt="contact-infor-icon" style={{ width: "16px", height: "16px" }} />
                        <span style={{ fontSize: "16px" }} className="ml-1">Địa chỉ giao hàng</span>
                      </div>
                      <hr />
                      <div className="d-flex">
                        <div className="form-group col-6">
                          <label htmlFor="inputFirstName">Họ</label>
                          <input type="text" className="form-control" name="inputFirstName" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputFirstName || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputFirstName && orderFormik.touched.inputFirstName && (
                            <small className="active-error" >{orderFormik.errors.inputFirstName}</small>
                          )}
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="inputLastName">Tên</label>
                          <input type="text" className="form-control" name="inputLastName" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputLastName || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputLastName && orderFormik.touched.inputLastName && (
                            <small className="active-error" >{orderFormik.errors.inputLastName}</small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="form-group col-8">
                          <label htmlFor="inputAddress1">Địa chỉ 1</label>
                          <input type="text" className="form-control" name="inputAddress1" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputAddress1 || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputAddress1 && orderFormik.touched.inputAddress1 && (
                            <small className="active-error" >{orderFormik.errors.inputAddress1}</small>
                          )}
                        </div>
                        <div className="form-group col-4">
                          <label htmlFor="inputHouseNumber">Số nhà</label>
                          <input type="text" className="form-control" name="inputHouseNumber" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputHouseNumber || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputHouseNumber && orderFormik.touched.inputHouseNumber && (
                            <small className="active-error" >{orderFormik.errors.inputHouseNumber}</small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="form-group col-12">
                          <label htmlFor="inputAddress2">Địa chỉ 2</label>
                          <input type="text" className="form-control" name="inputAddress2" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputAddress2 || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputAddress2 && orderFormik.touched.inputAddress2 && (
                            <small className="active-error" >{orderFormik.errors.inputAddress2}</small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="form-group col-6">
                          <label htmlFor="inputCity">Thành phố</label>
                          <input type="text" className="form-control" name="inputCity" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputCity || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputCity && orderFormik.touched.inputCity && (
                            <small className="active-error" >{orderFormik.errors.inputCity}</small>
                          )}
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="inputCountry">Quốc gia</label>
                          <input type="text" className="form-control" name="inputCountry" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputCountry || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputCountry && orderFormik.touched.inputCountry && (
                            <small className="active-error" >{orderFormik.errors.inputCountry}</small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="form-group col-6">
                          <label htmlFor="inputState">Quận huyện</label>
                          <input type="text" className="form-control" name="inputState" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputState || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputState && orderFormik.touched.inputState && (
                            <small className="active-error" >{orderFormik.errors.inputState}</small>
                          )}
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="inputPostalCode">Mã bưu chính</label>
                          <input type="text" className="form-control" name="inputPostalCode" style={{ borderRadius: "12px" }}
                            value={orderFormik.values.inputPostalCode || ''}
                            onChange={orderFormik.handleChange}
                          />
                          {orderFormik.errors.inputPostalCode && orderFormik.touched.inputPostalCode && (
                            <small className="active-error" >{orderFormik.errors.inputPostalCode}</small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-3" style={{ borderRadius: "12px" }}>
                {/* <div className="card-header" role="tab" id="step3header">
                <h5 className="mb-0">
                  <a data-toggle="collapse" data-parent="#cart-steps-accordion" href="#step3contentid" aria-expanded="true" aria-controls="step3contentid" className="text-uppercase header">
                    <span className="steps">2</span>
                    <span className="label">Thanh toán đặt mua</span>
                    <i className="fa fa-chevron-right float-right" />
                  </a>
                </h5>
              </div> */}
                <div id="step3contentid" className="collapse in show" role="tabpanel" aria-labelledby="step3header">
                  <div className="card-body" style={{ padding: '0' }}>

                    {/* <div className="goigiaohang">
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
                  </div> */}

                    <div className="pttt">
                      <div className="col-12 mt-3">
                        <img src={paymentIcon} alt="contact-infor-icon" style={{ width: "16px", height: "16px" }} />
                        <span style={{ fontSize: "16px" }} className="ml-1">Thanh toán</span>
                      </div>
                      <hr />

                      <div className="d-flex">
                        <div className="form-group col-12 d-flex">
                          <input className="mr-2" type="radio" name="inputPayment" id="payCash"
                            value="pay-cash"
                            checked={orderFormik.values.inputPayment === "pay-cash"}
                            onChange={orderFormik.handleChange}
                          />
                          <label className="form-check-label" htmlFor="payCash">
                            <img src={iconPayCash} alt="payment-cash" className="payment" />
                            Thanh toán tiền mặt khi nhận hàng
                          </label>
                        </div>
                      </div>

                      <div className="form-group col-12 d-flex">
                        <input className="mr-2" type="radio" name="inputPayment" id="payATM"
                          value="pay-atm"
                          checked={orderFormik.values.inputPayment === "pay-atm"}
                          onChange={orderFormik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="payATM">
                          <img src={iconPayATM} alt="payment-atm" className="payment" />
                          Thẻ ATM nội địa/Internet Banking (Miễn phí thanh toán)
                        </label>
                      </div>

                    </div>
                    {/* <hr /> */}
                    {/* <p className="text-center note-before-checkout">(Vui lòng kiểm tra lại đơn hàng trước khi Đặt Mua)</p> */}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="col-md-6 cart">
        <div className="cart-content py-3 pl-3">
          <h4 className=""><strong>Thông tin đơn hàng</strong></h4>
          <hr></hr>

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
            <div className="col-md-12">
              <div className="tonggiatien">
                <div className="group d-flex justify-content-between">
                  <p className="label">Tạm tính</p>
                  <p className="tamtinh">{new Intl.NumberFormat('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(totalPrice)} ₫</p>
                </div>
                <div className="group d-flex justify-content-between"></div>
                  <p className="label">Phí vận chuyển</p>
                  <p className="phivanchuyen">{new Intl.NumberFormat('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(shippingFee)} ₫</p>
                </div>
                <div className="group d-flex justify-content-between align-items-center">
                  <strong className="text-uppercase">Tổng cộng</strong>
                  <p className="tongcong">{new Intl.NumberFormat('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(totalPrice + shippingFee)} ₫</p>
                </div>
                {/* <small className="note d-flex justify-content-end text-muted"> (Giá đã bao gồm VAT) </small> */}
              </div>
            </div>
          </div>

          <br />
          <button
            type="submit"
            className="btn btn-lg btn-block btn-checkout text-uppercase text-white"
            style={{ borderRadius: "9999px", backgroundColor: "#111827", border: "none", padding: "14px" }}
            form="orderForm"
            onClick={orderFormik.handleSubmit}
          >
            Đặt mua
          </button>
        </div>
      {loader}
    </>
  )
}

export default CartExists;
