import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import userAPI from '../../apis/userAPI';
import { errorToast, successToast } from '../Toasts/Toasts';

const ForgotPassword = () => {
  let forgotPassFormik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Bắt buộc nhập email !")
        .email("Không đúng định dạng email")
    }),
    onSubmit: (values, { resetForm }) => {
      userAPI.forgotPassword(values).then(res => {
        if (res.data.message === 'USER_NOT_FOUND') {
          errorToast("Người dùng không tồn tại !");
        }
        if (res.data.message === 'FAILED_SEND_EMAIL') {
          errorToast("Gửi mail lỗi !");
        }
        if (res.data.message === 'SUCCESS') {
          successToast("Mật khẩu mới đã được gửi vào mail của bạn !");
          resetForm({ values: ''});
        }
      }).catch(err => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại sau !");
      })
    }
  });
  return (
    <form onSubmit={forgotPassFormik.handleSubmit}>
      <div className="mb-3">
        <div className="input-group">
          <input type="email" className="form-control" name="email" placeholder="Nhập địa chỉ email khôi phục mật khẩu..." aria-label="Recipient's username" aria-describedby="basic-addon2"
            value={forgotPassFormik.values.email}
            onChange={forgotPassFormik.handleChange}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-warning" type="submit">Gửi</button>
          </div>
        </div>
        {forgotPassFormik.errors.email && forgotPassFormik.touched.email && (
          <small style={{ color: 'red' }}>{forgotPassFormik.errors.email}</small>
        )}
      </div>
    </form>
  )
}

export default ForgotPassword
