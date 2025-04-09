import React, { useEffect, useState } from 'react';
import './OrderDetail.css';
import { Link } from 'react-router-dom';
import orderAPI from '../../apis/orderAPI';
import homeAPI from '../../apis/homeAPI';

const OrderDetail = (props) => {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});
  useEffect(() => {
    orderAPI.getOrderDetailByCode(props.match.params.code).then((res) => {
      setOrder(res.data.data.order);
      setProducts(res.data.data.products);
    }).catch((err) => {
      console.log(err);
    })

    homeAPI.getPaymentInfo().then(res => {
      console.log(res.data);
      setPaymentInfo(res.data);
    }).catch(err => {
      console.log(err);
    });

  }, [props.match.params.code]);
  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/orders/history">Quản lý đơn hàng</Link></li>
            <li className="breadcrumb-item active"><a href="# " >Chi tiết đơn hàng #{props.match.params.code}</a></li>
          </ol>
        </div>
      </section>
      <section className="content">
        <div className="container">
          <div className="row">
            <div className="col-4 col-md-4">
              <div className="title">ĐỊA CHỈ NGƯỜI NHẬN</div>
              <div className="content-receiver">
                <p>{order.o_firstName} {order.o_lastName}</p>
                <p>Số điện thoại: {order.o_phone} </p>
                <p>Địa chỉ 1: {order.o_shippingAddress1}</p>
                <p>Số nhà: {order.o_shippingHouseNumber}</p>
                <p>Địa chỉ 2: {order.o_shippingAddress2}</p>
                <p>Quốc gia: {order.o_shippingCountry} </p>
                <p>Thành phố: {order.o_shippingCity} </p>
                <p>Quận/Huyện: {order.o_shippingState} </p>
                <p>Mã bưu điện: {order.o_shippingPostalcode} </p>
              </div>
            </div>
            <div className="col-4 col-md-4">
              <div className="title">HÌNH THỨC GIAO HÀNG</div>
              <div className="content-receiver">
                <p> {order.o_shippingFee === 15000 ? 'Giao hàng chuẩn' : 'Giao hàng nhanh (2h-3h)'} </p>
              </div>
            </div>
            <div className="col-4 col-md-4">
              <div className="title">HÌNH THỨC THANH TOÁN</div>
              <div className="content-receiver">
                <p>{order.o_payment === 'pay-cash' ? 'Thanh toán bằng tiền mặt khi nhận hàng' : 'Thanh toán QR Code'}</p>
                {order.o_payment === "pay-qr-code" && paymentInfo && (
                  <div className="col-12 mt-3 payment-info-container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
                    <h5 className="mb-3">Quét mã QR để thanh toán</h5>
                    {paymentInfo.qrCode && (
                      <div className="text-center mt-3">
                        <img
                          src={paymentInfo.qrCode.url}
                          alt="QR Code"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </div>
                    )}
                    <div className="mt-3 text-danger">
                      <small>* Thông tin chuyển khoản: </small><span><b>{order.o_code}</b></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="content-product-order">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Hình ảnh</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <span className="font-weight-bold">{v.product.p_name}</span><br />
                              <span className="ml-2">
                                Màu sắc - {v.variant.color.name}
                              </span>
                              <br />
                              <span className="ml-2">
                                Kích thước - {v.size?.name}
                              </span>
                              <br />
                            </td>
                            <td>
                              <img src={v.variant.images.length > 0 ? v.variant.images[0].url : 'N/A'} alt="product" style={{ height: '100px' }} />
                            </td>
                            <td>{new Intl.NumberFormat('vi-VN', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(v.product.p_promotion > 0 ? v.product.p_promotion : v.product.p_price)} ₫</td>
                            <td>{v.quantity}</td>
                            <td>{new Intl.NumberFormat('vi-VN', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(v.price)} ₫</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4"><span>Tạm tính</span></td>
                      <td>{new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(order.o_totalPrice - order.o_shippingFee)} ₫</td>
                    </tr>
                    {/* <tr>
                      <td colSpan="4"><span>Giảm giá</span></td>
                      <td>0 ₫</td>
                    </tr> */}
                    <tr>
                      <td colSpan="4"><span>Phí vận chuyển</span></td>
                      <td>{new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(order.o_shippingFee)} ₫</td>
                    </tr>
                    <tr>
                      <td colSpan="4"><span>Tổng cộng</span></td>
                      <td>{new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(order.o_totalPrice)} ₫</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 py-2">
              {
                order.o_status === 'Đã hủy' ? (<button className="btn" style={{ background: '#F5A623', minWidth: '200px' }} >Đơn hàng đã hủy</button>) :
                  (<Link to={`/orders/tracking/${props.match.params.code}`} className="btn" style={{ background: '#F5A623', minWidth: '200px' }}>Theo dõi đơn hàng</Link>)
              }
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OrderDetail
