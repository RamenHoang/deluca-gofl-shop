import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import userAPI from '../../apis/userAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import getCookie from '../../utils/getCookie';

const TabUpdatePass = () => {

  let updatePassFormik = useFormik({
    initialValues: {
      inputOldPassword: '',
      inputNewPassword: '',
      inputReNewPassword: ''
    },
    validationSchema: Yup.object({
      inputOldPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu"),
      inputNewPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu"),
      inputReNewPassword: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .required("Bắt buộc nhập mật khẩu")
        .oneOf([Yup.ref("inputNewPassword")], "Mật khẩu phải trùng nhau")
    }),
    onSubmit: (values, { resetForm }) => {
      let data = {
        id: getCookie('currentUserId'),
        newPassword: values.inputNewPassword,
        oldPassword: values.inputOldPassword
      };

      userAPI.updatePasswordByUserId(data).then((res) => {
        if (res.data.message === 'USER_NOT_FOUND' ) {
          errorToast("Người dùng không tồn tại !");
        }
        if (res.data.message === 'PASSWORD_IS_WRONG') {
          errorToast("Mật khẩu cũ không chính xác !");
        }
        if (res.data.message === 'SUCCESS') {
          successToast("Cập nhật mật khẩu thành công !");
          resetForm({ values: '' });
        }
      }).catch(err => {
        errorToast("Có lỗi xảy ra , vui lòng thử lại !");
      })
    }
  });

  return (
    <div className="tab-pane fade py-3" id="nav-password" role="tabpanel" aria-labelledby="nav-password-tab">
      <div className="offset-md-4 mt-3">
        <h3 className="account-header">Cập nhật mật khẩu</h3>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-9">
            <form onSubmit={updatePassFormik.handleSubmit}>
              <div className="form-group row">
                <label htmlFor="inputOldPassword" className="col-sm-3 col-form-label">Mật khẩu cũ (*)</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" name="inputOldPassword" placeholder="Mật khẩu cũ ..."
                    value={updatePassFormik.values.inputOldPassword}
                    onChange={updatePassFormik.handleChange}
                  />

                  {updatePassFormik.errors.inputOldPassword && updatePassFormik.touched.inputOldPassword && (
                    <small style={{ color: "red" }}> { updatePassFormik.errors.inputOldPassword}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputNewPassword" className="col-sm-3 col-form-label">Mật khẩu mới (*)</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" name="inputNewPassword" placeholder="Mật khẩu mới ..."
                    value={updatePassFormik.values.inputNewPassword}
                    onChange={updatePassFormik.handleChange}
                  />

                  {updatePassFormik.errors.inputNewPassword && updatePassFormik.touched.inputNewPassword && (
                    <small style={{ color: "red" }}> { updatePassFormik.errors.inputNewPassword}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputReNewPassword" className="col-sm-3 col-form-label">Mật khẩu mới (*)</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" name="inputReNewPassword" placeholder="Mật khẩu mới ..."
                    value={updatePassFormik.values.inputReNewPassword || ''}
                    onChange={updatePassFormik.handleChange}
                  />

                  {updatePassFormik.errors.inputReNewPassword && updatePassFormik.touched.inputReNewPassword && (
                    <small style={{ color: "red" }}> { updatePassFormik.errors.inputReNewPassword}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <button type="submit" className="btn btn-outline-warning" style={{ margin: "0px auto" }}>Cập nhật</button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TabUpdatePass;
