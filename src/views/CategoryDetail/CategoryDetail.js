/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import homeAPI from "./../../apis/homeAPI";
import "./CategoryDetail.css";
import ItemBook from "../../components/ItemBook/ItemBook";
import FilterPrice from "./FilterPrice";
import FilterCategory from "./FilterCategory";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { debounce, set } from 'lodash';
import { successToast } from "../../components/Toasts/Toasts";

const CategoryDetail = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  //pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //all books
  const [books, setBooks] = useState([]);
  const [showNotFound, setShowNotFound] = useState(false);

  // Filter states
  const cateId = queryString.parse(props.location.search).cateid;
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  useEffect(() => {
    // This effect only runs when cateId changes
    homeAPI.getSubCategories(cateId)
      .then((res) => {
        setSubCategories(res.data.data);
        setSelectedCategories(res.data.data.map(item => item._id));
      });
    window.scrollTo(0, 0);
  }, [cateId]);

  useEffect(() => {
    // This effect handles the book fetching based on filter conditions
    receivedData();
  }, [props.location.search, selectedCategories, minPrice, maxPrice, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const debouncedReceivedData = debounce(() => {
    showLoader();
    homeAPI
      .getBooksByCateIds([cateId, ...selectedCategories], minPrice, maxPrice, page)
      .then((res) => {
        if (res.data.data.length > 0) {
          setBooks([...books, ...res.data.data]);
          setShowNotFound(false);
        } else if (books.length > 0) {
          setHasMore(false);
          successToast("Đã hiển thị tất cả sản phẩm.");
        } else {
          setShowNotFound(true);
        }

        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });
  }, 500);

  let receivedData = () => {
    debouncedReceivedData();
  };

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item active">
              <a href="# ">Cửa hàng</a>
            </li>
          </ol>
        </div>
      </section>

      <section className="banner">
        <div className="container">
          {/* <a href="# "><img src={skt} alt="banner-sach-ktkn" className="img-fluid" /></a> */}
        </div>
      </section>

      <section className="content my-4">
        <div className="container">
          <div className="noidung bg-white" style={{ width: "100%" }}>
            {/* header của khối sản phẩm : tag(tác giả), bộ lọc và sắp xếp  */}
            {/* <div className="header-khoi-sp d-flex justify-content-between py-2">
              <h5 className="pt-2 pl-2">TẤT CẢ SẢN PHẨM</h5>
            </div> */}
            {/* các sản phẩm  */}
            <div className="row">
              <div className="col-12 col-md-3 col-sm-3">
                {/* <h5 style={{ paddingTop: "10px", textAlign: "center" }}>
                  CHẾ ĐỘ LỌC
                </h5> */}

                <FilterCategory
                  categories={subCategories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  setPage={setPage}
                  setBooks={setBooks}
                  setHasMore={setHasMore}
                />

                <FilterPrice
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  setPage={setPage}
                  setBooks={setBooks}
                  setHasMore={setHasMore}
                />

                {/* <FilterRating
                  handleFilter={handleFilter}
                  cateId={queryString.parse(props.location.search).cateid}
                  books={books}
                /> */}

                {/* <div className="item-filter">
                  <h6>TÁC GIẢ</h6>
                  <hr />
                </div>

                <div className="item-filter">
                  <h6>NHÀ XUẤT BẢN</h6>
                  <div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" />
                      <label className="form-check-label" htmlFor="defaultCheck2"> Nhà XB Kim Đồng </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" />
                      <label className="form-check-label" htmlFor="defaultCheck2"> Nhà XB Kim Đồng </label>
                    </div>
                  </div>
                  <hr />
                </div> */}
              </div>
              <div className="col-12 col-md-9 col-sm-9">
                <div className="items">
                  <div className="row">
                    {showNotFound && (
                      <h3 className="text-danger">Không tìm thấy sản phẩm nào.</h3>
                    )}
                    {books.map((v, i) => {
                      return (
                        <div
                          className="col-lg-4 col-md-3 col-6 item DeanGraziosi"
                          key={i}
                        >
                          <ItemBook info={v} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* pagination bar */}
            {books.length > 0 && hasMore && (
              <div className="text-center mt-4">
                <button className="btn btn-primary load-more-btn" onClick={loadMore}>Load More</button>
              </div>
            )}
            {/*het khoi san pham*/}
          </div>
          {/*het div noidung*/}
        </div>
        {/*het container*/}
        {loader}
      </section>
    </>
  );
};

export default CategoryDetail;
