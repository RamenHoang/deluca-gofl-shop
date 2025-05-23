import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import homeAPI from '../../apis/homeAPI';
import './BookDetail.css';
import TabEvaluate from './TabEvaluate';
import Cart from './../../utils/cart';
import { successToast } from './../../components/Toasts/Toasts';

import ItemBook from '../../components/ItemBook/ItemBook';
import addToCartIcon from '../../assets/images/add-to-cart-icon.png';
import { toast } from 'react-toastify';
import ModalImage from "react-modal-image";

const BookDetail = (props) => {
  const [book, setBook] = useState({});
  const [booksRelated, setBooksRelated] = useState([]);
  const [itemCart, setItemCart] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [selectedSize, setSelectedSize] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    let bookId = queryString.parse(props.location.search).pid;
    homeAPI.getBookById(bookId).then((res) => {
      setBook(res.data.data);
      if (res.data.data.variants.length > 0 && res.data.data.variants[0].images.length > 0) {
        setSelectedImage(res.data.data.variants[0].images[0].url);
      }
      setSelectedVariant(res.data.data.variants[0]);
      setSelectedThumbnail(0);
      if (res.data.data.variants[0].sizes.filter((size) => size && size.stock > 0).length > 0) {
        setSelectedSize(res.data.data.variants[0].sizes.filter((size) => size && size.stock > 0)[0]);
      } else {
        toast.error('Sản phẩm đã hết hàng');
        setSoldOut(true);
      }
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
    if (selectedSize.stock < itemCart + 1) {
      toast.error('Số lượng sản phẩm không đủ');
      return;
    }

    let item = itemCart + 1;
    setItemCart(item);
  }

  let onChangeItemCart = (e) => {
    if (e.target.value > selectedSize.stock) {
      toast.error('Số lượng sản phẩm không đủ');
      return;
    }
    setItemCart(e.target.value);
  }

  let handleClickBuy = () => {
    let oldCart = JSON.parse(localStorage.getItem('cart'));
    let newCart = new Cart(oldCart ? oldCart : null);
    if (newCart.addCartWithQuantity(book, parseInt(itemCart), selectedVariant, selectedSize)) {
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(newCart));
      successToast("Thêm sản phẩm vào giỏ hàng thành công !");
      let total = JSON.parse(localStorage.getItem('cart')).totalQuantity;
      props.totalItem(total);
      setItemCart(1);
    }
  }
  
  let handleClickBuyNow = () => {
    let oldCart = JSON.parse(localStorage.getItem('cart'));
    let newCart = new Cart(oldCart ? oldCart : null);
    if (newCart.addCartWithQuantity(book, parseInt(itemCart), selectedVariant, selectedSize)) {
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(newCart));
      // successToast("Thêm sản phẩm vào giỏ hàng thành công !");`
      let total = JSON.parse(localStorage.getItem('cart')).totalQuantity;
      props.totalItem(total);
      setItemCart(1);
      props.history.push('/cart');
    }
  }

  const handleThumbnailClick = (index, url) => {
    setSelectedThumbnail(index);
    setSelectedImage(url);
  };

  const handleChangeVariant = (variant) => {
    setSelectedVariant(variant);
    if (variant.sizes.filter((size) => size && size.stock > 0).length > 0) {
      setSelectedSize(variant.sizes.filter((size) => size)[0]);
    }
    setSelectedThumbnail(0);
    if (variant.images.length > 0) {
      setSelectedImage(variant.images[0].url);
    }
  }

  const handleSizeChartClick = () => {
    setShowSizeChart(true);
  };

  const handleCloseSizeChart = () => {
    setShowSizeChart(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'size-chart-popup') {
      setShowSizeChart(false);
    }
  };

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            {book.category && book.category.map((cate, index) => (
              <li className="breadcrumb-item">
                <Link to={`/categories?cateid=${cate._id}&c_slug=${cate.c_slug}`}>{cate.c_name}</Link>
              </li>
            ))}
            <li className="breadcrumb-item active"><a href="# "> {book.p_name} </a></li>
          </ol>
        </div>
      </section>

      <section className="product-page mb-5">
        <div className="container">
          {/* chi tiết 1 sản phẩm */}
          <div className="product-detail bg-white">
            <div className="row">
              <div className="col-md-7 d-flex khoianh-container">
                {/* ảnh  */}
                <div className="col-md-2 khoianh">
                  <div className="thumbnail-container">
                    {selectedVariant.images && selectedVariant.images.map((image, index) => (
                      <img
                        key={index}
                        className="thumbnail"
                        src={image.url}
                        alt={`Thumbnail ${index}`}
                        onClick={() => handleThumbnailClick(index, image.url)}
                        style={{ border: selectedThumbnail === index ? '2px solid #0EA5E9CC' : 'none' }}
                      />
                    ))}
                  </div>
                </div>
                {/* preview area */}
                <div className="col-md-10 khoianh">
                  <div className="anhto mb-4">
                    <ModalImage
                      small={selectedImage}
                      large={selectedImage}
                      alt={book.p_name}
                      hideDownload={true}
                      hideZoom={true}
                      className="product-image"
                      style={{ width: '100%', borderRadius: '16px' }}
                    />
                    {/* <a className="active" href="# " data-fancybox="thumb-img">
                      <img className="product-image" src={selectedImage} alt={book.p_name} style={{ width: '100%', borderRadius: '16px' }} />
                    </a> */}
                  </div>
                </div>
              </div>
              {/* thông tin sản phẩm */}
              <div className="col-md-5 khoithongtin">
                <div className="d-flex" style={{ border: "1px solid #E5E7EB", borderRadius: "16px", padding: "10px 0px", flexDirection: "column" }}>
                  <div className="col-md-12 header d-flex justify-content-between">
                    <div className="d-flex">
                      <i className="fa fa-star" style={{ color: "#FBBF24", fontSize: "12px", lineHeight: "1.5" }} />
                      <span style={{ fontSize: "12px", color: "#4B5563" }}>
                        &nbsp;{book.rating}&nbsp;({book.number_of_rating})
                      </span>
                    </div>
                    <div>
                      <div className="giabia" style={{ fontWeight: "bold" }}>{new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(book.p_promotion > 0 ? book.p_promotion : book.p_price)} ₫</div>
                      {book.p_promotion > 0 && (<div className="giacu text-muted" style={{ textDecoration: 'line-through' }}>{new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(book.p_price)} ₫</div>)}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="font-weight-bold">Màu sắc {selectedVariant.color ? `- ${selectedVariant.color.name}` : ''}</label>
                      <br></br>
                      {book.variants && book.variants.map((variant, index) => (
                        <img
                          src={variant.images.length > 0 ? variant.images[0].url : ''}
                          alt={variant.color.name}
                          onClick={() => handleChangeVariant(variant)}
                          style={{
                            cursor: 'pointer',
                            marginRight: '10px',
                            marginBottom: '10px',
                            width: '70px',
                            height: '70px',
                            border: selectedVariant === variant ? '2px solid #000' : 'none',
                            borderRadius: '12px',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="font-weight-bold">Kích thước {selectedSize.size ? `- ${selectedSize.size.name}` : ''}</label>
                      <br></br>
                      {selectedVariant.sizes && selectedVariant.sizes.filter((size) => size.size).map((size, index) => (
                        <button
                          key={index}
                          onClick={() => size.stock > 0 ? setSelectedSize(size) : null}
                          className="col-2"
                          style={{
                            cursor: size.stock > 0 ? 'pointer' : 'not-allowed',
                            marginRight: '10px',
                            marginBottom: '10px',
                            padding: '5px 10px',
                            border: selectedSize === size ? '2px solid #000' : '1px solid #ccc',
                            backgroundColor: size.stock <= 0 ? '' : (selectedSize === size ? '#0EA5E9' : '#fff'),
                            color: size.stock <= 0 ? '#fff' : (selectedSize === size ? '#fff' : '#000'),
                            borderRadius: '12px',
                          }}
                        >
                          {size.size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-12 d-flex align-items-center justify-content-between mt-3">
                    <div className="input-number input-group col-3" style={{ paddingLeft: "0px" }}>
                      <div className="d-flex" style={{ backgroundColor: "#F8F8F8", borderRadius: "9999px", padding: "8px" }}>
                        <div className="input-group-prepend">
                          <span className="input-group-text btn-spin btn-dec d-flex" style={{ borderRadius: "50%", width: "30px", height: "30px", alignItems: "center", justifyContent: "center" }} onClick={itemCartDecrease}>-</span>
                        </div>
                        <input type="text" value={itemCart} className="soluongsp text-center" style={{ backgroundColor: "transparent", border: "none" }} onChange={onChangeItemCart} />
                        <div className="input-group-append">
                          <span className="input-group-text btn-spin btn-inc" style={{ borderRadius: "50%", width: "30px", height: "30px", alignItems: "center", justifyContent: "center" }} onClick={itemCartIncrease}>+</span>
                        </div>
                      </div>
                    </div>
                    {book.sizeChart && (
                      <div>
                        <img src="//www.callawayapparel.com/cdn/shop/t/434/assets/size-chart-icon.svg?v=9763383541208223451740753041" width="30" height="auto" alt="Size Guide Image - See the size chart" title="See the size chart"></img>
                        <button onClick={handleSizeChartClick} className="btn btn-link" style={{ textDecoration: "underline", color: "black", fontWeight: "bold" }}>Size Chart</button>
                      </div>
                    )}
                  </div>
                  {!soldOut && (
                    <div className="col-md-12 d-flex align-items-center justify-content-between mt-3">
                      <div className="col-6 justify-content-start" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                        <button className="btn btn-primary" style={{ borderRadius: "9999px", backgroundColor: "#111827", border: "none", padding: "10px" }} onClick={handleClickBuyNow}>
                          <img src={addToCartIcon} alt="Add to cart" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
                          Mua ngay
                        </button>
                      </div>
                      <div className="col-6 d-flex justify-content-end" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                        <button className="btn btn-primary" style={{ borderRadius: "9999px", backgroundColor: "#111827", border: "none", padding: "10px" }} onClick={handleClickBuy}>
                          <img src={addToCartIcon} alt="Add to cart" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
                          Thêm giỏ hàng
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="col-md-12 mt-3 d-flex justify-content-between">
                    <div>
                      {new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format((book.p_promotion > 0 ? book.p_promotion : book.p_price))} ₫ x {itemCart}
                    </div>
                    <div>
                      {new Intl.NumberFormat('vi-VN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format((book.p_promotion > 0 ? book.p_promotion : book.p_price) * itemCart)} ₫
                    </div>
                  </div>
                  <div className="col-md-12 mt-3">
                    <hr />
                  </div>
                  <div className="col-md-12 mt-3 d-flex justify-content-between">
                    <h6>Tổng tiền:</h6>
                    <h6>{new Intl.NumberFormat('vi-VN', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format((book.p_promotion > 0 ? book.p_promotion : book.p_price) * itemCart)} ₫</h6>
                  </div>
                </div>
              </div>
              {/* decripstion của 1 sản phẩm: giới thiệu , đánh giá độc giả  */}
              <div className="product-description col-md-12 col-12 mt-5">
                {/* 2 tab ở trên  */}
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active text-uppercase" id="nav-gioithieu-tab" data-toggle="tab" href="#nav-gioithieu" role="tab" aria-controls="nav-gioithieu" aria-selected="true">Giới thiệu</a>
                    <a className="nav-item nav-link text-uppercase" id="nav-danhgia-tab" data-toggle="tab" href="#nav-danhgia" role="tab" aria-controls="nav-danhgia" aria-selected="false">Đánh giá</a>
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

      <section className="_1khoi combohot mt-5">
        <div className="container">
          <div className="noidung bg-white" style={{ width: '100%' }}>
            <div className="">
              <h2 className="header">Sản phẩm gợi ý</h2>
              {/* <div className="col-12 d-flex justify-content-between align-items-center pb-2 bg-light">
                <a href="# " className="btn btn-warning btn-sm text-white">Xem tất cả</a>
              </div> */}
            </div>
            <div className="khoisanpham">
              <div className="row">
                {booksRelated.map((product, index) => (
                  <div className="col-6 col-lg-3 col-md-4" key={index}>
                    <ItemBook info={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSizeChart && (
        <div className="size-chart-popup" onClick={handleOutsideClick}>
          <div className="size-chart-content">
            <span className="close" onClick={handleCloseSizeChart}>&times;</span>
            <img src={book.sizeChart.url} alt="Size Chart" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  )
}

export default BookDetail;
