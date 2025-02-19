import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderAPI from '../../apis/orderAPI';
import formatCurrency from 'format-currency';
import formatDate from './../../utils/formatDate';
import { errorToast, successToast } from './../../components/Toasts/Toasts';

const Order = () => {
  const [orders, setOders] = useState([]);
  useEffect(() => {
    orderAPI.getAllOrderOfUser().then(res => {
      if (res.data.message === 'SUCCESS') {
        setOders(res.data.data);
        console.log(res.data.data);
      }
    }).catch(err => {
      console.log(err);
    });
    window.scrollTo(0, 0);
  }, []);

  let destroyOrder = (id) => {
    orderAPI.destroyOrderById(id).then((res) => {
      if (res.data.message === 'NOT_FOUND') {
        errorToast("Đơn hàng không tồn tại")
      }
      if (res.data.message === 'SUCCESS') {
        successToast("Hủy đơn hàng thành công");
      }
    }).catch(err => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại sau")
    })
  }

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item active"><a href="# ">Quản lý đơn hàng</a></li>
          </ol>
        </div>
      </section>
      <section className="content">
        <div className="container">
          <table className="table table-hover">
            <thead style={{ background: '#dee2e9' }}>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái đơn hàng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {
                orders.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <Link to={`/orders/view/${v.o_code}`} >  {v.o_code} </Link>
                      </td>
                      <td> {formatDate(v.createdAt)} </td>
                      <td>{formatCurrency(v.o_totalPrice)} ₫</td>
                      <td>{v.o_status}</td>
                      <td>
                        {
                          v.o_status === "Đã hủy" ? (`Đã hủy lúc: ` + formatDate(v.updatedAt) ) :
                            ( v.o_status === "Đang giao hàng" || v.o_status === "Đã giao hàng" ? '' :
                            (<button className="btn btn-danger" onClick={() => destroyOrder(v._id)}>
                            <i className="fas fa-trash-alt mr-1"></i>
                            Hủy đơn hàng </button>) )
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default Order;
