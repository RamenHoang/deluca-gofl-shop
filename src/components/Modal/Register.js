import React from 'react';
import './Register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userAPI from '../../apis/userAPI';
import { errorToast, successToast } from './../../components/Toasts/Toasts';

const Register = () => {

  const registerFormik = useFormik({
    initialValues: {
      inputUsername: '',
      inputEmail: '',
      inputToken: '',
      inputPassword: '',
      inputRePassword: ''
    },
    validationSchema: Yup.object({
      inputUsername: Yup.string()
        .required("Bắt buộc nhập họ tên !"),
      inputEmail: Yup.string()
        .required("Bắt buộc nhập email !")
        .email("Không đúng định dạng email !"),
      inputPassword: Yup.string()
        .required("Bắt buộc nhập mật khẩu !")
        .min(6, "Mật khẩu ngắn nhất là 6 kí tự !")
        .max(30, "Mật khẩu dài nhất là 30 kí tự"),
      inputRePassword: Yup.string()
        .required("Bắt buộc lại nhập mật khẩu !")
        .min(6, "Mật khẩu ngắn nhất là 6 kí tự !")
        .max(30, "Mật khẩu dài nhất là 30 kí tự")
        .oneOf([Yup.ref("inputPassword")], "Mật khẩu phải trùng nhau !")
    }),
    onSubmit: (values, { resetForm }) => {
      let data = {
        username: values.inputUsername,
        email: values.inputEmail,
        password: values.inputPassword,
      };

      userAPI.register(data).then(res => {
        if (res.data.message === 'EMAIL_EXISTS') {
          errorToast("Email đã được sử dụng, chọn email khác !");
        }
        if (res.data.message === 'SUCCESS') {
          successToast("Đăng kí tài khoản thành công, vui lòng vào email để kích hoạt tài khoản !");
          resetForm({ values: '' });
        }
        if (res.data.message === 'FAILED_SEND_EMAIL') {
          errorToast("Gửi mail không thành công do lỗi bảo mật của google !");
        }
      }).catch(err => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
    }
  });

  return (
    <div className="modal fade mt-5" id="formdangky" data-backdrop="static" tabIndex={-1} aria-labelledby="dangky_tieude" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <ul className="tabs d-flex justify-content-around list-unstyled mb-0">
              <li className="tab tab-dangnhap text-center">
                <a className="text-decoration-none" href="# ">Đăng nhập</a>
                <hr />
              </li>
              <li className="tab tab-dangky text-center">
                <a className="text-decoration-none" href="# " >Đăng ký</a>
                <hr />
              </li>
            </ul>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form id="form-signup" className="form-signin mt-2" onSubmit={registerFormik.handleSubmit}>

              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputUsername">Họ tên (*)</label>
                  <input type="text" className="form-control" placeholder="Nhập họ và tên..." name="inputUsername"
                    value={registerFormik.values.inputUsername}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.errors.inputUsername && registerFormik.touched.inputUsername && (
                    <small className="active-error" >{registerFormik.errors.inputUsername}</small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputEmail">Email (*)</label>
                  <input type="text" className="form-control" placeholder="Nhập địa chỉ email..." name="inputEmail"
                    value={registerFormik.values.inputEmail}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.errors.inputEmail && registerFormik.touched.inputEmail && (
                    <small className="active-error" >{registerFormik.errors.inputEmail}</small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputPassword">Mật khẩu (*) </label>
                  <input type="password" className="form-control" placeholder="Nhập mật khẩu..." name="inputPassword"
                    value={registerFormik.values.inputPassword}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.errors.inputPassword && registerFormik.touched.inputPassword && (
                    <small className="active-error" >{registerFormik.errors.inputPassword}</small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label htmlFor="inputRePassword">Nhập lại mật khẩu (*) </label>
                  <input type="password" className="form-control" placeholder="Nhập lại mật khẩu..." name="inputRePassword"
                    value={registerFormik.values.inputRePassword}
                    onChange={registerFormik.handleChange}
                  />
                  {registerFormik.errors.inputRePassword && registerFormik.touched.inputRePassword && (
                    <small className="active-error" >{registerFormik.errors.inputRePassword}</small>
                  )}
                </div>
              </div>

              <button className="btn btn-lg btn-block btn-signin text-uppercase text-white mt-3" type="submit" style={{ background: '#F5A623' }}>Đăng ký</button>
              <hr className="mt-3 mb-2" />
              <div className="custom-control custom-checkbox">
                <p className="text-center">Bằng việc đăng ký, bạn đã đồng ý với DeLuCa về</p>
                <a href="# " className="text-decoration-none text-center" style={{ color: '#F5A623' }}>Điều khoản dịch
                  vụ &amp; Chính sách bảo mật</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
