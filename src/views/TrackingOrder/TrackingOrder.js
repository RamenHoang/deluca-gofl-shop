import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrackingOrder.css';
import orderAPI from './../../apis/orderAPI';
import formatDate from './../../utils/formatDate';

const TrackingOrder = (props) => {
  const [order, setOrder] = useState({});

  useEffect(() => {
    orderAPI.getOrderDetailByCode(props.match.params.code).then((res) => {
      setOrder(res.data.data.order);
      console.log(res.data.data.order);
    }).catch((err) => {
      console.log(err);
    })

  }, [props.match.params.code]);

  let tracking = (status) => {
    if (status === 'Đặt hàng thành công') {
      return (
        <>
          <div className="step active"> <span className="icon"> <i className="fa fa-check"></i> </span> <span className="text">Đặt hàng thành công</span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-user"></i> </span> <span className="text"> Tiếp nhận đơn hàng</span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-truck"></i> </span> <span className="text">Đang giao hàng </span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-box"></i> </span> <span className="text">Giao hàng thành công</span> </div>
        </>
      )
    }
    if (status === 'Tiếp nhận') {
      return (
        <>
          <div className="step active"> <span className="icon"> <i className="fa fa-check"></i> </span> <span className="text">Đặt hàng thành công</span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-user"></i> </span> <span className="text"> Tiếp nhận đơn hàng</span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-truck"></i> </span> <span className="text">Đang giao hàng </span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-box"></i> </span> <span className="text">Giao hàng thành công</span> </div>
        </>
      )
    }
    if (status === 'Đang giao hàng') {
      return (
        <>
          <div className="step active"> <span className="icon"> <i className="fa fa-check"></i> </span> <span className="text">Đặt hàng thành công</span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-user"></i> </span> <span className="text"> Tiếp nhận đơn hàng</span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-truck"></i> </span> <span className="text">Đang giao hàng </span> </div>
          <div className="step"> <span className="icon"> <i className="fa fa-box"></i> </span> <span className="text">Giao hàng thành công</span> </div>
        </>
      )
    }
    if (status === 'Đã giao hàng') {
      return (
        <>
          <div className="step active"> <span className="icon"> <i className="fa fa-check"></i> </span> <span className="text">Đặt hàng thành công</span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-user"></i> </span> <span className="text"> Tiếp nhận đơn hàng</span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-truck"></i> </span> <span className="text">Đang giao hàng </span> </div>
          <div className="step active"> <span className="icon"> <i className="fa fa-box"></i> </span> <span className="text">Giao hàng thành công</span> </div>
        </>
      )
    }
  }

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/orders/history">Quản lý đơn hàng</Link></li>
            <li className="breadcrumb-item"><Link to={`/orders/view/${props.match.params.code}`} >Chi tiết đơn hàng #{props.match.params.code}</Link></li>
            <li className="breadcrumb-item active"><a href="# " >Theo dõi đơn hàng #{props.match.params.code}</a></li>
          </ol>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="title">THÔNG TIN TRẠNG THÁI ĐƠN HÀNG</div>
              <div className="content-receiver">
                <h6>Trạng thái: {order.o_status} | {order.updatedAt ? formatDate(order.updatedAt) : formatDate(order.createdAt)} </h6>
                <div className="track">
                  {tracking(order.o_status) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TrackingOrder;
