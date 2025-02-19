import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import userAPI from '../../apis/userAPI';
import getCookie from '../../utils/getCookie';
import { errorToast, successToast } from '../../components/Toasts/Toasts';

const TabInfo = ({ userInfo }) => {

  let updateInfoFormik = useFormik({
    initialValues: {
      inputUsername: userInfo.username,
      inputEmail: userInfo.email,
      inputGender: userInfo.gender,
      inputDateOfBirth: userInfo.dateOfBirth,
      inputAddress: userInfo.address,
      inputPhoneNumber: userInfo.phone,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputUsername: Yup.string()
        .required("Bắt buộc nhập tên !")
        .max(100, "Tên quá dài, nhỏ hơn 100 kí tự !"),
      inputPhoneNumber: Yup.string()
        .nullable()
        .min(10, "Số điện thoại nằm trong khoảng 10 -> 11 số")
        .max(11, "Số điện thoại nằm trong khoảng 10 -> 11 số")
    }),
    onSubmit: (values) => {
      let data = {
        username: values.inputUsername,
        gender: values.inputGender,
        email: values.inputEmail,
        address: values.inputAddress,
        phone: values.inputPhoneNumber,
        dateOfBirth: values.inputDateOfBirth
      }

      userAPI.updateUserById(getCookie('currentUserId'), data).then((res) => {
        if (res.data.message === 'USER_NOT_FOUND') {
          errorToast("Tài khoản không tồn tại !");
        }
        if (res.data.message === 'SUCCESS') {
          successToast("Cập nhật thông tin thành công");
        }
      }).catch(err => {
        errorToast("Có lỗi xảy ra , vui lòng thử lại !");
      })
    }
  });

  return (
    <div className="tab-pane fade show active pl-4 " id="nav-taikhoan" role="tabpanel" aria-labelledby="nav-taikhoan-tab">
      <div className="offset-md-4 mt-3">
        <h3 className="account-header">Thông tin tài khoản</h3>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-9">
            <form onSubmit={updateInfoFormik.handleSubmit}>
              <div className="form-group row">
                <label htmlFor="inputUsername" className="col-sm-2 col-form-label">Họ tên (*)</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="inputUsername" placeholder="Họ tên ..."
                    value={updateInfoFormik.values.inputUsername || ''}
                    onChange={updateInfoFormik.handleChange}
                  />

                  {updateInfoFormik.errors.inputUsername && updateInfoFormik.touched.inputUsername && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputUsername}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email (*)</label>
                <div className="col-sm-10">
                  <input type="email" className="form-control" disabled name="inputEmail" placeholder="Địa chỉ email...."
                    value={updateInfoFormik.values.inputEmail || ''}
                    onChange={userInfo.handleChange}
                  />

                  {updateInfoFormik.errors.inputEmail && updateInfoFormik.touched.inputEmail && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputEmail}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputGender" className="col-sm-2 col-form-label">Giới tính (*)</label>
                <div className="col-sm-10" style={{ lineHeight: '37px' }}>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inputGender" id="inputMale" value="male"
                      checked={updateInfoFormik.values.inputGender === 'male'}
                      onChange={updateInfoFormik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inputMale">Nam</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inputGender" id="inputFemale" value="female"
                      checked={updateInfoFormik.values.inputGender === 'female'}
                      onChange={updateInfoFormik.handleChange}
                    />
                    <label className="form-check-label" htmlFor="inputFemale">Nữ</label>
                  </div>

                  {updateInfoFormik.errors.inputGender && updateInfoFormik.touched.inputGender && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputGender}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputDateOfBirth" className="col-2 col-form-label">Năm sinh</label>
                <div className="col-10">
                  <input className="form-control" type="date" name="inputDateOfBirth"
                    value={updateInfoFormik.values.inputDateOfBirth || ''}
                    onChange={updateInfoFormik.handleChange}
                  />
                  {updateInfoFormik.errors.inputDateOfBirth && updateInfoFormik.touched.inputDateOfBirth && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputDateOfBirth}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Địa chỉ (*)</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="inputAddress" placeholder="Địa chỉ ..."
                    value={updateInfoFormik.values.inputAddress || ''}
                    onChange={updateInfoFormik.handleChange}
                  />
                  {updateInfoFormik.errors.inputAddress && updateInfoFormik.touched.inputAddress && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputAddress}</small>
                  )}
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="inputPhoneNumber" className="col-sm-2 col-form-label">SĐT (*)</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="inputPhoneNumber" placeholder="Số điện thoại ..."
                    value={updateInfoFormik.values.inputPhoneNumber || ''}
                    onChange={updateInfoFormik.handleChange}
                  />
                  {updateInfoFormik.errors.inputPhoneNumber && updateInfoFormik.touched.inputPhoneNumber && (
                    <small style={{ color: "red" }}> { updateInfoFormik.errors.inputPhoneNumber}</small>
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

export default TabInfo
