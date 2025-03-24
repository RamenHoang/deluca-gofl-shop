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
  const [shouldSelect, setShouldSelect] = useState(false);

  // Filter states
  const cateId = queryString.parse(props.location.search).cateid;
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([cateId]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  // Add a state to track when first useEffect completes
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // This effect only runs when cateId changes
    homeAPI.getCateById(cateId)
      .then((res) => {
        const isParent = res.data.data.is_parent;
        homeAPI.getSubCategories(cateId)
          .then((res) => {
            setSubCategories(res.data.data);
            if (isParent) {
              setSelectedCategories(res.data.data.map(item => item._id));
            }
            // Mark initial load as complete
            setInitialLoadComplete(true);
          });
      });
    window.scrollTo(0, 0);
  }, [cateId]);

  useEffect(() => {
    // This effect handles the book fetching based on filter conditions
    // Only run if initialLoadComplete is true
    if (initialLoadComplete) {
      receivedData();
    }
  }, [props.location.search, selectedCategories, minPrice, maxPrice, page, initialLoadComplete]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const debouncedReceivedData = debounce(() => {
    showLoader();
    if (selectedCategories.length === 0) {
      hideLoader();
      setBooks([]);
      setShouldSelect(true);
      return;
    }

    homeAPI
      .getBooksByCateIds([...selectedCategories], minPrice, maxPrice, page)
      .then((res) => {
        if (res.data.data.length > 0) {
          setBooks([...books, ...res.data.data]);
          setShowNotFound(false);
          setShouldSelect(false);
        } else if (books.length > 0) {
          setHasMore(false);
          successToast("Đã hiển thị tất cả sản phẩm.");
        } else {
          setShouldSelect(false);
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
                    {showNotFound && !shouldSelect && (
                      <h3 className="text-danger">Không tìm thấy sản phẩm nào.</h3>
                    )}
                    {shouldSelect && (
                      <h3 className="text-danger">Vui lòng chọn danh mục.</h3>
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
                  {books.length > 0 && hasMore && (
                    <div className="text-center mt-4">
                      <button className="btn btn-primary load-more-btn" onClick={loadMore}>Load More</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* pagination bar */}
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
