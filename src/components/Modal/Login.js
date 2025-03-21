import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userAPI from "../../apis/userAPI";
import { errorToast, successToast } from "../Toasts/Toasts";
import setCookie from "./../../utils/setCookie";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import ForgotPassword from "./ForgotPassword";
import { gapi } from "gapi-script";
import useFullPageLoader from "../../hooks/useFullPageLoader";
const Login = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const clientId =
    "335392280387-movej9d8ba23mctqbbn8j3a21dend1cd.apps.googleusercontent.com";
  const [forgotPass, setForgotPass] = useState(false);
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: clientId });
    });
  }, []);
  let loginFormik = useFormik({
    initialValues: {
      inputEmail: "",
      inputPassword: "",
    },
    validationSchema: Yup.object({
      inputEmail: Yup.string()
        .required("Bắt buộc nhập email !")
        .email("Định dạng email !"),
      inputPassword: Yup.string()
        .required("Bắt buộc nhập mật khẩu !")
        .min(6, "Mật khẩu ngắn nhất là 6 kí tự !")
        .max(30, "Mật khẩu dài nhất là 30 kí tự !"),
    }),
    onSubmit: (values) => {
      let data = {
        email: values.inputEmail,
        password: values.inputPassword,
      };
      showLoader();
      userAPI
        .login(data)
        .then((res) => {
          hideLoader();
          if (res.data.message === "EMAIL_NOT_EXISTS") {
            errorToast("Email không tồn tại !");
          }
          if (res.data.message === "NON_ACTIVE") {
            errorToast(
              "Tài khoản chưa được active, vui lòng vào email để active tài khoản"
            );
          }
          if (res.data.message === "PASSWORD_IS_WRONG") {
            errorToast("Sai mật khẩu !");
          }
          if (res.data.message === "SUCCESS") {
            successToast("Đăng nhập thành công !");
            document.cookie =
              "authUserToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie =
              "currentUserId=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

            setCookie("authUserToken", res.data.token, 2, "/");
            setCookie("currentUserId", res.data.userId, 2, "/");

            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        })
        .catch((err) => {
          hideLoader();
          errorToast("Có lỗi xảy ra, vui lòng thử lại !");
        });
    },
  });

  let responseLoginWithFacebook = (res) => {
    userAPI
      .loginWithFacebook({ accessToken: res.accessToken, userId: res.userID })
      .then((res) => {
        if (res.data.message === "SUCCESS") {
          successToast("Đăng nhập thành công !");
          document.cookie =
            "authUserToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "currentUserId=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

          setCookie("authUserToken", res.data.token, 2, "/");
          setCookie("currentUserId", res.data.userId, 2, "/");

          window.location.reload();
        }
      })
      .catch((err) => { });
  };

  let responseLoginWithGoogle = (res) => {
    userAPI
      .loginWithGoogle({ tokenId: res.tokenId })
      .then((res) => {
        if (res.data.message === "SUCCESS") {
          successToast("Đăng nhập thành công !");
          document.cookie =
            "authUserToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "currentUserId=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

          setCookie("authUserToken", res.data.token, 2, "/");
          setCookie("currentUserId", res.data.userId, 2, "/");

          window.location.reload();
        }

        if (res.data.message === "FAILED_SEND_EMAIL") {
          errorToast("Lỗi gửi mail");
        }

        if (res.data.message === "SUCCESS_LOGIN_WITH_GOOGLE") {
          successToast(
            "Đăng nhập thành công ! Vui lòng ghé qua email của bạn để xem mật khẩu đăng nhập cho lần tiếp theo"
          );
          document.cookie =
            "authUserToken=;expires = Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "currentUserId=;expires = Thu, 01 Jan 1970 00:00:00 GMT";

          setCookie("authUserToken", res.data.token, 2, "/");
          setCookie("currentUserId", res.data.userId, 2, "/");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="modal fade mt-5"
      id="formdangnhap"
      data-backdrop="static"
      tabIndex={-1}
      aria-labelledby="dangnhap_tieude"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <ul className="tabs d-flex justify-content-around list-unstyled mb-0">
              <li className="tab tab-dangnhap text-center">
                <a className=" text-decoration-none" href="# ">
                  Đăng nhập
                </a>
                <hr />
              </li>
              <li className="tab tab-dangky text-center">
                <a className="text-decoration-none" href="# ">
                  Đăng ký
                </a>
                <hr />
              </li>
            </ul>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              id="form-signin"
              className="form-signin mt-2"
              onSubmit={loginFormik.handleSubmit}
            >
              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputEmail">Email (*) </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email..."
                    name="inputEmail"
                    value={loginFormik.values.inputEmail}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.errors.inputEmail &&
                    loginFormik.touched.inputEmail && (
                      <small className="active-error">
                        {loginFormik.errors.inputEmail}
                      </small>
                    )}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputPassword">Mật khẩu (*) </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu..."
                    name="inputPassword"
                    value={loginFormik.values.inputPassword}
                    onChange={loginFormik.handleChange}
                  />
                  {loginFormik.errors.inputPassword &&
                    loginFormik.touched.inputPassword && (
                      <small className="active-error">
                        {loginFormik.errors.inputPassword}
                      </small>
                    )}
                </div>
              </div>
              <button
                className="btn btn-lg btn-block btn-signin text-uppercase text-white"
                type="submit"
                style={{ background: "#F5A623" }}
              >
                Đăng nhập
              </button>
              <hr className="my-4" />
              <div className="custom-control custom-checkbox mb-3">
                <a
                  onClick={() => setForgotPass(!forgotPass)}
                  href="# "
                  className="float-right text-decoration-none"
                  style={{ color: "#F5A623" }}
                >
                  Quên mật khẩu
                </a>
              </div>
            </form>

            {forgotPass ? <ForgotPassword /> : ""}

            {/* <GoogleLogin
              clientId={clientId}
              render={(renderProps) => (
                <>
                  <button
                    className="btn btn-lg btn-google btn-block text-uppercase mb-2"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    {" "}
                    <i className="fab fa-google mr-2" />
                    Đăng nhập bằng Google
                  </button>
                </>
              )}
              buttonText="Đăng nhập bằng Google"
              onSuccess={responseLoginWithGoogle}
              onFailure={responseLoginWithGoogle}
              cookiePolicy={"single_host_origin"}
            />
            <FacebookLogin
              appId="317532176245919"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseLoginWithFacebook}
              cssClass="btn btn-lg btn-facebook btn-block text-uppercase"
              icon="fab fa-facebook-f mr-2"
              textButton="Đăng nhập bằng facebook"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
