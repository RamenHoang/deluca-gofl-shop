import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Account.css';
import TabInfo from './TabInfo';
import userAPI from './../../apis/userAPI';
import getCookie from '../../utils/getCookie';
import TabUpdatePass from './TabUpdatePass';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Account = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    showLoader();
    userAPI.getUserById(getCookie('currentUserId')).then((res) => {
      setUserInfo(res.data.data);
      hideLoader();
    }).catch(err => {
      console.log(err);
      hideLoader();
    })
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item active"><a href="# ">Thông tin tài khoản</a></li>
          </ol>
        </div>
      </section>
      <section className="account-page">
        <div className="container">
          <div className="page-content bg-white">
            <div className="account-page-tab-content m-4">
              {/* 2 tab: thông tin tài khoản, danh sách đơn hàng  */}
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a className="nav-item nav-link active" id="nav-taikhoan-tab" data-toggle="tab" href="#nav-taikhoan" role="tab" aria-controls="nav-home" aria-selected="true">Thông tin tài khoản</a>
                  <a className="nav-item nav-link" id="nav-password-tab" data-toggle="tab" href="#nav-password" role="tab" aria-controls="nav-profile" aria-selected="false">Cập nhật mật khẩu</a>
                </div>
              </nav>
              {/* nội dung 2 tab */}
              <div className="tab-content">
                {/* nội dung tab 1: thông tin tài khoản  */}
                <TabInfo
                  userInfo={userInfo}
                />

                {/* nội dung tab 2: Cập nhật mật khẩu */}
                <TabUpdatePass />

              </div>
            </div>
          </div>
        </div>
      </section>
      {loader}
    </>
  )
}

export default Account;
