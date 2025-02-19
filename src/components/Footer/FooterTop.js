import React from 'react';
import iconBook from './../../assets/images/icon-books.png';
import iconShip from './../../assets/images/icon-ship.png';
import iconGift from './../../assets/images/icon-gift.png';
import iconReturn from './../../assets/images/icon-return.png';

const FooterTop = () => {
  return (
    <section className="abovefooter text-white" style={{ backgroundColor: '#f3f700' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="dichvu d-flex align-items-center">
              <img src={iconBook} alt="Book" />
              <div className="noidung">
                <h3 className="tieude font-weight-bold">HƠN 14.000 TỰA SÁCH HAY</h3>
                <p className="detail">Tuyển chọn bởi DeLuCa</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="dichvu d-flex align-items-center">
              <img src={iconShip} alt="Ship" />
              <div className="noidung">
                <h3 className="tieude font-weight-bold">MIỄN PHÍ GIAO HÀNG</h3>
                <p className="detail">Từ 15.000 đ ở TP.Hà Nội</p>
                <p className="detail">Từ 30.000 đ ở tỉnh thành khác</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="dichvu d-flex align-items-center">
              <img src={iconGift} alt="icon-gift" />
              <div className="noidung">
                <h3 className="tieude font-weight-bold">QUÀ TẶNG MIỄN PHÍ</h3>
                <p className="detail">Tặng Bookmark</p>
                <p className="detail">Bao sách miễn phí</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="dichvu d-flex align-items-center">
              <img src={iconReturn} alt="icon-return" />
              <div className="noidung">
                <h3 className="tieude font-weight-bold">ĐỔI TRẢ NHANH CHÓNG</h3>
                <p className="detail">Hàng bị lỗi được đổi trả nhanh chóng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default FooterTop
