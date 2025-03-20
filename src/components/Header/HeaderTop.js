import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userAPI from "../../apis/userAPI";
import homeAPI from "../../apis/homeAPI";
import { successToast } from "../Toasts/Toasts";
import getCookie from "./../../utils/getCookie";
import FormSearch from "./FormSearch";
import "./HeaderTop.css";
import logo from "./../../assets/images/logo.png";
import cartIcon from "./../../assets/images/cart-icon.png";
import userIcon from "./../../assets/images/user-icon.png";

const token = getCookie("authUserToken");

const HeaderTop = (props) => {
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let id = getCookie("currentUserId");
    if (id) {
      userAPI.getUserById(id).then((res) => {
        setUser(res.data.data);
      });
    }

    homeAPI.getAllCategories().then((res) => {
      const _categories = res.data.data;

      const childrens = _categories.filter((cate) => cate.c_parent);
      const parents = _categories.filter((cate) => cate.c_parent === undefined);

      setCategories(parents.map((parent) => {
        const _childrens = childrens.filter((cate) => cate.c_parent._id === parent._id);
        return {
          ...parent,
          childrens: _childrens
        };
      }));
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  let handleLogout = () => {
    document.cookie =
      "authUserToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "currentUserId=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    successToast("Đăng xuất thành công !");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const renderCategories = () => {
    return categories.map((parent) => (
      <li className="nav-item dropdown mr-3" key={parent._id}>
        <Link
          className="nav-link dropdown-toggle"
          to={`/categories?cateid=${parent._id}&c_slug=${parent.c_slug}`}
          id={`dropdown-${parent._id}`}
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          style={{ textTransform: "uppercase" }}
        >
          {parent.c_name}
        </Link>
        {parent.childrens && parent.childrens.length > 0 && (
          <ul className="dropdown-menu show-on-hover" aria-labelledby={`dropdown-${parent._id}`}>
            {parent.childrens.map((child) => (
              <li key={child._id} style={{ marginBottom: "5px" }}>
                <Link
                  className="dropdown-item sub-category"
                  to={`/categories?cateid=${child._id}&c_slug=${child.c_slug}`}
                >
                  {child.c_name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light sticky-top" style={{ backgroundColor: "#fff", display: "block" }}>
      <div className="container">

        {/* logo  */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
        {/* navbar-toggler  */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          {/* form tìm kiếm  */}
          <FormSearch />
          {/* ô đăng nhập đăng ký giỏ hàng trên header  */}
          <ul className="navbar-nav mb-1 ml-auto">
            {token !== "" ? (
              <div className="dropdown">
                <li
                  className="nav-item account d-flex user-curr"
                  type="button"
                  data-toggle="dropdown"
                >
                  {/* <a href="# " className="btn btn-secondary rounded-circle">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="user-avatar"
                        className="img-avatar"
                      />
                    ) : (
                      <img
                        src="./avatar.png"
                        alt="user-avatar"
                        className="img-avatar"
                      />
                    )}
                  </a> */}
                  <div className="info-logout">
                    <a href="# " className="nav-link text-uppercase username" style={{ color: "rgba(75, 85, 99, 0.8) !important" }}
                    >
                      {user.username}
                    </a>
                    <a className="nav-link logout" href="# " style={{ color: "rgba(75, 85, 99, 0.8) !important" }}>
                      Tài khoản <i className="fas fa-caret-down"></i>
                    </a>
                  </div>
                </li>
                <div className="dropdown-menu">
                  <span className="item-info">
                    <img src={userIcon} alt="user-icon" style={{ width: "24px", height: "24px" }} />
                    <Link to="/account"> Quản lý tài khoản </Link>
                  </span>
                  <span className="item-info">
                    <img src={cartIcon} alt="cart-icon" style={{ width: "24px", height: "24px" }} />
                    <Link to="/orders/history">Quản lý đơn hàng</Link>{" "}
                  </span>
                  <span className="item-info" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />{" "}
                    <a href="# "> Đăng xuất </a>{" "}
                  </span>
                </div>
              </div>
            ) : (
              <div className="dropdown">
                <li
                  className="nav-item account user-not-login"
                  type="button"
                  data-toggle="dropdown"
                  id="dropdownMenuButton"
                >
                  <a href="# " className="btn btn-secondary rounded-circle _icon">
                    <img src={userIcon} alt="user-icon" style={{ width: "24px", height: "24px" }} />
                  </a>
                  <a
                    className="nav-link text-dark text-uppercase"
                    href="# "
                    style={{ display: "none" }}
                  >
                    Tài khoản
                  </a>
                </li>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <a
                    className="dropdown-item nutdangky text-center mb-2"
                    href="# "
                    data-toggle="modal"
                    data-target="#formdangky"
                  >
                    Đăng ký
                  </a>
                  <a
                    className="dropdown-item nutdangnhap text-center"
                    href="# "
                    data-toggle="modal"
                    data-target="#formdangnhap"
                  >
                    Đăng nhập
                  </a>
                </div>
              </div>
            )}
            <li className="nav-item giohang">
              <Link to="/cart" className="btn btn-secondary rounded-circle _icon">
                <img src={cartIcon} alt="cart-icon" style={{ width: "24px", height: "24px" }} />
                <div className="cart-amount"> {props.totalItem} </div>
              </Link>
              <Link
                to="/cart"
                className="nav-link text-dark giohang text-uppercase"
                style={{ display: "none" }}
              >
                Giỏ Hàng
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ justifyContent: "center" }}>
        <div className="list-categories-container">
          <ul className="navbar-nav mr-auto list-categories">
            {renderCategories()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderTop;
