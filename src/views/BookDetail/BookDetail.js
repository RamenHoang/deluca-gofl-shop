import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import homeAPI from '../../apis/homeAPI';
import './BookDetail.css';
import SimpleSlider from '../../components/Slick/SimpleSlider';
import TabEvaluate from './TabEvaluate';
import Cart from './../../utils/cart';
import { successToast } from './../../components/Toasts/Toasts';
import formatCurrency from 'format-currency';

const BookDetail = (props) => {
  const [book, setBook] = useState({});
  const [booksRelated, setBooksRelated] = useState([]);
  const [itemCart, setItemCart] = useState(1);

  useEffect(() => {
    let bookId = queryString.parse(props.location.search).pid;
    homeAPI.getBookById(bookId).then((res) => {
      setBook(res.data.data);
    }).catch(err => {
      console.log(err);
    });

    homeAPI.getProductsRelated(bookId).then(res => {
      setBooksRelated(res.data.data);
    })

    window.scrollTo(0, 0);

  }, [props.location.search]);


  let itemCartDecrease = () => {
    if (itemCart > 1) {
      let item = itemCart - 1;
      setItemCart(item);
    }
  }

  let itemCartIncrease = () => {
    let item = itemCart + 1;
    setItemCart(item);
  }

  let onChangeItemCart = (e) => {

  }

  let handleClickBuy = () => {
    let oldCart = JSON.parse(localStorage.getItem('cart'));
    let newCart = new Cart(oldCart ? oldCart : null);
    newCart.addCartWithQuantity(book, book._id, parseInt(itemCart));
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(newCart));
    successToast("Thêm sản phẩm vào giỏ hàng thành công !");
    let total = JSON.parse(localStorage.getItem('cart')).totalQuantity;
    props.totalItem(total);
    setItemCart(1);
  }

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item">
              <Link to={`/categories?cateid=${book.category ? book.category._id : ''}&c_slug=${book.category ? book.category.c_slug : ''}`}>{book.category ? book.category.c_name : ''}</Link>
            </li>
            <li className="breadcrumb-item active"><a href="# "> {book.p_name} </a></li>
          </ol>
        </div>
      </section>

      <section className="product-page mb-4">
        <div className="container">
          {/* chi tiết 1 sản phẩm */}
          <div className="product-detail bg-white p-4">
            <div className="row">
              {/* ảnh  */}
              <div className="col-md-5 khoianh">
                <div className="anhto mb-4">
                  <a className="active" href="# " data-fancybox="thumb-img">
                    <img className="product-image" src={book.p_image_detail ? book.p_image_detail.url : ''} alt={book.p_name} style={{ width: '100%' }} />
                  </a>
                </div>
              </div>
              {/* thông tin sản phẩm: tên, giá bìa giá bán tiết kiệm, các khuyến mãi, nút chọn mua.... */}
              <div className="col-md-7 khoithongtin">
                <div className="row">
                  <div className="col-md-12 header">
                    <h4 className="ten">{book.p_name}</h4>
                    <div className="rate">
                      <i className="fa fa-star active" />
                      <i className="fa fa-star active" />
                      <i className="fa fa-star active" />
                      <i className="fa fa-star active" />
                      <i className="fa fa-star " />
                    </div>
                    <hr />
                  </div>
                  <div className="col-md-7">
                    <div className="gia">
                      <div className="giabia">Giá bìa:<span className="giacu ml-2">{formatCurrency(book.p_price)} ₫</span></div>
                      <div className="giaban">Giá bán tại DeLuCa: <span className="giamoi font-weight-bold"> {formatCurrency(book.p_promotion)} ₫</span></div>
                      <div className="tietkiem">Tiết kiệm: <b>{formatCurrency(book.p_price - book.p_promotion)} ₫</b>
                      </div>
                    </div>
                    <div className="uudai my-3">
                      <h6 className="header font-weight-bold">Khuyến mãi &amp; Ưu đãi tại DeLuCa:</h6>
                      <ul>
                        <li><b>Miễn phí giao hàng </b>cho đơn hàng từ 150.000đ ở HN và 300.000đ ở
                          Tỉnh/Thành khác <a href="# ">&gt;&gt; Chi tiết</a></li>
                        <li><b>Combo sách HOT - GIẢM 25% </b><a href="# ">&gt;&gt;Xem ngay</a></li>
                        <li>Bao sách miễn phí (theo yêu cầu)</li>
                      </ul>
                    </div>

                    <div className="soluong d-flex">
                      <label className="font-weight-bold">Số lượng: </label>
                      <div className="input-number input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text btn-spin btn-dec" onClick={itemCartDecrease}>-</span>
                        </div>
                        <input type="text" value={itemCart} className="soluongsp text-center" onChange={onChangeItemCart} />
                        <div className="input-group-append">
                          <span className="input-group-text btn-spin btn-inc" onClick={itemCartIncrease}>+</span>
                        </div>
                      </div>
                    </div>
                    <div className="nutmua btn w-100 text-uppercase" onClick={handleClickBuy}>Chọn mua</div>



                    <a className="huongdanmuahang text-decoration-none" href="# ">(Vui lòng xem hướng dẫn mua hàng)</a>
                    <div className="fb-like" data-href="https://www.facebook.com/DealBook-110745443947730/" data-width="300px" data-layout="button" data-action="like" data-size="small" data-share="true" />
                  </div>
                  {/* thông tin khác của sản phẩm:  tác giả, ngày xuất bản, kích thước ....  */}
                  <div className="col-md-5">
                    <div className="thongtinsach">
                      <ul>
                        <li>Tác giả: <a href="# " className="tacgia">
                          {book.author ? book.author.map((v, i) => {
                            return (
                              <span key={i}>
                                {`${v.a_name}  -`}
                              </span>
                            )
                          }) : ''
                          }
                        </a>
                        </li>
                        <li>Ngày xuất bản: <b>{book.p_datepublic}</b></li>
                        <li>Nhà xuất bản: {book.company ? book.company.c_name : ''} </li>
                        <li>Số trang: <b>336</b></li>
                        <li>Cân nặng: <b>0</b></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* decripstion của 1 sản phẩm: giới thiệu , đánh giá độc giả  */}
              <div className="product-description col-md-12 col-12">
                {/* 2 tab ở trên  */}
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active text-uppercase" id="nav-gioithieu-tab" data-toggle="tab" href="#nav-gioithieu" role="tab" aria-controls="nav-gioithieu" aria-selected="true">Giới thiệu</a>
                    <a className="nav-item nav-link text-uppercase" id="nav-danhgia-tab" data-toggle="tab" href="#nav-danhgia" role="tab" aria-controls="nav-danhgia" aria-selected="false">Đánh
                      giá của độc giả</a>
                  </div>
                </nav>
                {/* nội dung của từng tab  */}
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active ml-3" id="nav-gioithieu" role="tabpanel" aria-labelledby="nav-gioithieu-tab">
                    <h6 className="tieude font-weight-bold">{book.p_name}</h6>
                    {parse(book.p_description ? book.p_description : "")}
                  </div>

                  <TabEvaluate book={book._id} />

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="_1khoi combohot mt-4">
        <div className="container">
          <div className="noidung bg-white" style={{ width: '100%' }}>
            <div className="row">
              <div className="col-12 d-flex justify-content-between align-items-center pb-2 bg-light">
                <h5 className="header text-uppercase" style={{ fontWeight: 400 }}>SẢN PHẨM LIÊN QUAN</h5>
                <a href="# " className="btn btn-warning btn-sm text-white">Xem tất cả</a>
              </div>
            </div>
            <div className="khoisanpham">
              <SimpleSlider
                books={booksRelated}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BookDetail;
