import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import commentAPI from '../../apis/commentAPI';
import { errorToast, successToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Evaluate = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  let commentFormik = useFormik({
    initialValues: {
      star: '',
      inputContent: ''
    },
    validationSchema: Yup.object({
      star: Yup.string()
        .required("Đánh giá số sao cho sản phẩm này !"),
      inputContent: Yup.string()
        .required("Nhập nội dung đánh giá !")
    }),
    
    onSubmit: (values, { resetForm }) => {
      // console.log(values);
      let data = {
        star: values.star,
        content: values.inputContent,
        product: props.bookId
      }
    
      showLoader();
      commentAPI.addNewComment(data).then((res) => {
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Đã gửi đánh giá sách !");
          props.newComments(res.data.data);
          resetForm({ values: '' });
        }
      }).catch(err => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      });
    }
  });

  return (
    <div className="formdanhgia">
      <form onSubmit={commentFormik.handleSubmit}>
        <h6 className="tieude text-uppercase">GỬI ĐÁNH GIÁ CỦA BẠN</h6>
        <span className="danhgiacuaban">Đánh giá của bạn về sản phẩm này:</span>
        <div className="rating d-flex flex-row-reverse align-items-center justify-content-end">
          <input type="radio" value="5" name="star" id="star1" onChange={commentFormik.handleChange} /><label htmlFor="star1" />
          <input type="radio" value="4" name="star" id="star2" onChange={commentFormik.handleChange} /><label htmlFor="star2" />
          <input type="radio" value="3" name="star" id="star3" onChange={commentFormik.handleChange} /><label htmlFor="star3" />
          <input type="radio" value="2" name="star" id="star4" onChange={commentFormik.handleChange} /><label htmlFor="star4" />
          <input type="radio" value="1" name="star" id="star5" onChange={commentFormik.handleChange} /><label htmlFor="star5" />
        </div>
        { commentFormik.errors.star && commentFormik.touched.star && (
            <small>{ commentFormik.errors.star }</small>
          ) }
        <div className="form-group">
          <input type="text" className="txtComment w-100" name="inputContent" placeholder="Đánh giá của bạn về sản phẩm này...."
            value={commentFormik.values.inputContent}
            onChange={commentFormik.handleChange}
          />

          { commentFormik.errors.inputContent && commentFormik.touched.inputContent && (
            <small>{ commentFormik.errors.inputContent }</small>
          ) }
        </div>
        <button type="submit" className="btn nutguibl">Gửi đánh giá</button>
      </form>
      { loader }
    </div>
  )
}

export default Evaluate;
