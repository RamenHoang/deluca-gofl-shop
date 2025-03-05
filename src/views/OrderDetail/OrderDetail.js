import React, { useEffect, useState } from 'react';
import './OrderDetail.css';
import { Link } from 'react-router-dom';
import orderAPI from '../../apis/orderAPI';
import formatCurrency from 'format-currency';

const OrderDetail = (props) => {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  useEffect(() => {
    orderAPI.getOrderDetailByCode(props.match.params.code).then((res) => {
      setOrder(res.data.data.order);
      setProducts(res.data.data.products);
    }).catch((err) => {
      console.log(err);
    })

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
                <h6>{order.o_nameReceiver}</h6>
                <p>Địa chỉ: {order.o_shippingAddress}</p>
                <p>Số điện thoại: {order.o_phoneReceiver} </p>
              </div>
            </div>
            <div className="col-4 col-md-4">
              <div className="title">HÌNH THỨC GIAO HÀNG</div>
              <div className="content-receiver">
                <p> {order.o_shippingFee  === 15000 ? 'Giao hàng chuẩn' : 'Giao hàng nhanh (2h-3h)'} </p>
              </div>
            </div>
            <div className="col-4 col-md-4">
              <div className="title">HÌNH THỨC THANH TOÁN</div>
              <div className="content-receiver">
                <p>{order.o_payment === 'pay-cash' ? 'Thanh toán bằng tiền mặt khi nhận hàng' : 'Thanh toán bằng thẻ'}</p>
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
                              <span className="font-weight-bold">{v.product.p_name}</span><br/>
                              {v.variant.option_values.map((optionValue, index) => (
                                <>
                                  <span key={index} className="ml-2">
                                    {optionValue.option.name} - {optionValue.value}
                                  </span>
                                  <br/>
                                </>
                              ))}
                            </td>
                            <td>
                              <img src={ v.variant.image.url } alt="product" style={{ height: '100px' }} />
                            </td>
                            <td>{formatCurrency(v.product.p_price)} ₫</td>
                            <td>{v.quantity}</td>
                            <td>{formatCurrency(v.price)} ₫</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4"><span>Tạm tính</span></td>
                      <td>{formatCurrency(order.o_totalPrice - order.o_shippingFee) } ₫</td>
                    </tr>
                    <tr>
                      <td colSpan="4"><span>Giảm giá</span></td>
                      <td>0 ₫</td>
                    </tr>
                    <tr>
                      <td colSpan="4"><span>Phí vận chuyển</span></td>
                      <td>{formatCurrency(order.o_shippingFee)} ₫</td>
                    </tr>
                    <tr>
                      <td colSpan="4"><span>Tổng cộng</span></td>
                      <td>{ formatCurrency(order.o_totalPrice)} ₫</td>
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
