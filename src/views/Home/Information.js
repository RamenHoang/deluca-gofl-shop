import React from "react";
import "./Information.css";
import freeShippingIcon from "../../assets/images/free-ship-icon.png";
import returnPolicyIcon from "../../assets/images/return-policy-icon.png";
import globalShippingIcon from "../../assets/images/global-shipping-icon.png";
import returnMoneyPolicyIcon from "../../assets/images/return-money-policy-icon.png";

const Information = () => {
  return (
    <div className="container">
        <div className="row information-container mt-5 mb-5">
          <div className="information-item d-flex align-items-center justify-content-center">
            <img src={freeShippingIcon} style={{width: "24px", height: "24px", marginRight: "10px"}} alt="Miễn phí vận chuyển" />
            <div>
              <span className="d-flex justify-content-start" style={{color: "#111827"}}><strong>Free Shipping</strong></span>
              <span className="d-flex justify-content-start" style={{color: "#4B5563"}}>Cho đơn hàng từ 2.000.000đ trở lên</span>
            </div>
          </div>
          <div className="information-item d-flex align-items-center justify-content-center">
            <img src={returnPolicyIcon} style={{width: "24px", height: "24px", marginRight: "10px"}} alt="Hoàn trả cực kỳ dễ dàng" />
            <div>
              <span className="d-flex justify-content-start" style={{color: "#111827"}}><strong>Hoàn trả cực kỳ dễ dàng</strong></span>
              <span className="d-flex justify-content-start" style={{color: "#4B5563"}}>Chỉ cần số điện thoại</span>
            </div>
          </div>
          <div className="information-item d-flex align-items-center justify-content-center">
            <img src={globalShippingIcon} style={{width: "24px", height: "24px", marginRight: "10px"}} alt="Giao hàng toàn cầu" />
            <div>
              <span className="d-flex justify-content-start" style={{color: "#111827"}}><strong>Giao hàng toàn cầu</strong></span>
              <span className="d-flex justify-content-start" style={{color: "#4B5563"}}>Giao hàng nhanh toàn cầu</span>
            </div>
          </div>
          <div className="information-item d-flex align-items-center justify-content-center">
            <img src={returnMoneyPolicyIcon} style={{width: "24px", height: "24px", marginRight: "10px"}} alt="Chính sách hoàn tiền" />
            <div>
              <span className="d-flex justify-content-start" style={{color: "#111827"}}><strong>Chính sách hoàn tiền</strong></span>
              <span className="d-flex justify-content-start" style={{color: "#4B5563"}}>Đổi trả trong 30 ngày</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Information;
