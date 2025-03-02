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
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    let bookId = queryString.parse(props.location.search).pid;
    homeAPI.getBookById(bookId).then((res) => {
      setBook(res.data.data);
      setSelectedImage(res.data.data.variants[0].image.url);
      setSelectedVariant(res.data.data.variants[0]);
      setSelectedThumbnail(0);
      setSelectedColor(res.data.data.variants[0].option_values.find(option => option.option.name === "Màu sắc").value);
      setSelectedSize(res.data.data.variants[0].option_values.find(option => option.option.name === "Kích cỡ").value);
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
    setItemCart(e.target.value);
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

  const handleVariantChange = (optionId, value) => {
    const newVariant = book.variants.find(variant =>
      variant.option_values.some(optionValue =>
        optionValue.option._id === optionId && optionValue.value === value
      )
    );
    setSelectedVariant(newVariant);
    setSelectedImage(newVariant.image.url);
    if (optionId === book.variants[0].option_values.find(option => option.option.name === "Màu sắc").option._id) {
      setSelectedColor(value);
      if (!newVariant.option_values.some(option => option.option.name === "Kích cỡ" && option.value === selectedSize)) {
        setSelectedSize(newVariant.option_values.find(option => option.option.name === "Kích cỡ").value);
      }
    } else if (optionId === book.variants[0].option_values.find(option => option.option.name === "Kích cỡ").option._id) {
      setSelectedSize(value);
    }
  };

  const handleThumbnailClick = (index, url) => {
    setSelectedThumbnail(index);
    setSelectedImage(url);
  };

  const getUniqueOptions = (optionName) => {
    const uniqueOptions = [];
    book.variants.forEach(variant => {
      variant.option_values.forEach(optionValue => {
        if (optionValue.option.name === optionName && !uniqueOptions.includes(optionValue.value)) {
          uniqueOptions.push(optionValue.value);
        }
      });
    });
    return uniqueOptions;
  };

  const isOptionDisabled = (optionName, value) => {
    if (optionName === "Màu sắc") {
      return !book.variants.some(variant =>
        variant.option_values.some(option => option.option.name === "Màu sắc" && option.value === value) &&
        variant.option_values.some(option => option.option.name === "Kích cỡ" && option.value === selectedSize)
      );
    } else if (optionName === "Kích cỡ") {
      return !book.variants.some(variant =>
        variant.option_values.some(option => option.option.name === "Kích cỡ" && option.value === value) &&
        variant.option_values.some(option => option.option.name === "Màu sắc" && option.value === selectedColor)
      );
    }
    return false;
  };

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
              <div className="col-md-2 khoianh">
                <div className="thumbnail-container">
                  {book.variants && book.variants.map((variant, index) => (
                    <img
                      key={index}
                      className="thumbnail"
                      src={variant.image.url}
                      alt={`Thumbnail ${index}`}
                      onClick={() => handleThumbnailClick(index, variant.image.url)}
                      style={{
                        cursor: 'pointer',
                        marginBottom: '10px',
                        width: '80px',
                        height: '80px',
                        border: selectedThumbnail === index ? '1px solid #0EA5E9CC' : 'none',
                        borderRadius: '16px'
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* preview area */}
              <div className="col-md-5 khoianh">
                <div className="anhto mb-4">
                  <a className="active" href="# " data-fancybox="thumb-img">
                    <img className="product-image" src={selectedImage} alt={book.p_name} style={{ width: '100%' }} />
                  </a>
                </div>
              </div>
              {/* thông tin sản phẩm */}
              <div className="col-md-5 khoithongtin" style={{ border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
                <div className="row">
                  <div className="col-md-12 header d-flex justify-content-between">
                    <div className="d-flex">
                      <i className="fa fa-star" style={{ color: "#FBBF24", fontSize: "12px", lineHeight: "1.5" }} />
                      <span style={{fontSize: "12px", color: "#4B5563"}}>
                        &nbsp;{book.rating}&nbsp;({book.number_of_rating})
                      </span>
                    </div>
                    <div>
                      <div className="giabia">{formatCurrency(book.p_price)} ₫</div>
                      <div className="giaban">{formatCurrency(book.p_promotion)} ₫</div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    {book.variants && book.variants[0].option_values.map((optionValue, index) => (
                      <div key={index}>
                        <label>{optionValue.option.name}</label>
                        {optionValue.option.name === "Màu sắc" ? (
                          <div className="d-flex">
                            {getUniqueOptions("Màu sắc").map((value, i) => (
                              <img
                                key={i}
                                src={book.variants.find(variant => variant.option_values.some(option => option.value === value)).image.url}
                                alt={value}
                                onClick={() => handleVariantChange(optionValue.option._id, value)}
                                style={{
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                  width: '40px',
                                  height: '40px',
                                  border: selectedVariant.option_values && selectedVariant.option_values.find(option => option.option._id === optionValue.option._id).value === value ? '2px solid #000' : 'none',
                                  opacity: isOptionDisabled("Màu sắc", value) ? 0.5 : 1
                                }}
                              />
                            ))}
                          </div>
                        ) : optionValue.option.name === "Kích cỡ" ? (
                          <div className="d-flex">
                            {getUniqueOptions("Kích cỡ").map((value, i) => (
                              <button
                                key={i}
                                onClick={() => handleVariantChange(optionValue.option._id, value)}
                                style={{
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                  padding: '5px 10px',
                                  border: selectedVariant.option_values && selectedVariant.option_values.find(option => option.option._id === optionValue.option._id).value === value ? '2px solid #000' : '1px solid #ccc',
                                  backgroundColor: selectedVariant.option_values && selectedVariant.option_values.find(option => option.option._id === optionValue.option._id).value === value ? '#0EA5E9' : '#fff',
                                  color: selectedVariant.option_values && selectedVariant.option_values.find(option => option.option._id === optionValue.option._id).value === value ? '#fff' : '#000',
                                  opacity: isOptionDisabled("Kích cỡ", value) ? 0.5 : 1,
                                  pointerEvents: isOptionDisabled("Kích cỡ", value) ? 'none' : 'auto'
                                }}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <select className="form-control" onChange={(e) => handleVariantChange(optionValue.option._id, e.target.value)}>
                            {book.variants.filter(variant =>
                              variant.option_values.some(value => value.option._id === optionValue.option._id)
                            ).map((variant, i) => (
                              <option key={i} value={variant.option_values.find(value => value.option._id === optionValue.option._id).value}>
                                {variant.option_values.find(value => value.option._id === optionValue.option._id).value}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="col-md-12 d-flex align-items-center mt-3">
                    <label className="font-weight-bold mr-3">Số lượng: </label>
                    <div className="input-number input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text btn-spin btn-dec" onClick={itemCartDecrease}>-</span>
                      </div>
                      <input type="text" value={itemCart} className="soluongsp text-center" onChange={onChangeItemCart} />
                      <div className="input-group-append">
                        <span className="input-group-text btn-spin btn-inc" onClick={itemCartIncrease}>+</span>
                      </div>
                    </div>
                    <button className="btn btn-primary ml-3" onClick={handleClickBuy}>Thêm vào giỏ hàng</button>
                  </div>
                  <div className="col-md-12 mt-3">
                    <h6>Ước tính tổng tiền: {formatCurrency((book.p_promotion > 0 ? book.p_promotion : book.p_price) * itemCart)} ₫</h6>
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
