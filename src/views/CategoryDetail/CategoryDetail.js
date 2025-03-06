/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import homeAPI from "./../../apis/homeAPI";
import "./CategoryDetail.css";
import ItemBook from "../../components/ItemBook/ItemBook";
import FilterPrice from "./FilterPrice";
import FilterCategory from "./FilterCategory";
import ReactPaginate from "react-paginate";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { debounce } from 'lodash';

const CategoryDetail = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [offSet, setOffSet] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [cate, setCate] = useState({});

  //all books
  const [books, setBooks] = useState([]);

  // Filter states
  const cateId = queryString.parse(props.location.search).cateid;
  const [selectedCategories, setSelectedCategories] = useState(cateId ? [cateId] : []);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  useEffect(() => {
    receivedData();
    window.scrollTo(0, 0);
  }, [props.location.search, selectedCategories, minPrice, maxPrice]);

  const debouncedReceivedData = debounce(() => {
    showLoader();
    homeAPI
      .getBooksByCateIds(selectedCategories, minPrice, maxPrice)
      .then((res) => {
        let data = res.data.data;
        let slice = data.slice(offSet, offSet + perPage);

        setBooks(slice);
        setPageCount(Math.ceil(data.length / perPage));
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

  //Click vao nut chuyen trang
  let handlePageClick = (e) => {
    let selectedPage = e.selected;
    let offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffSet(offset);
    showLoader();
    homeAPI
      .getBooksByCateIds(selectedCategories, minPrice, maxPrice)
      .then((res) => {
        let data = res.data.data;
        let slice = data.slice(offset, offset + perPage);

        setBooks(slice);
        setPageCount(Math.ceil(data.length / perPage));
        hideLoader();
      })
      .catch((err) => {
        hideLoader();
        console.log(err);
      });
  };

  let handleFilter = (content) => {
    setBooks([...content]);
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
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />

                <FilterPrice
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
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
                    {books.map((v, i) => {
                      return (
                        <div
                          className="col-lg-4 col-md-3 col-xs-6 item DeanGraziosi"
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
            <div className="pagination-bar my-3">
              <div className="row">
                <div className="col-12 ">
                  <ReactPaginate
                    previousLabel={"← Prev"}
                    nextLabel={"Next →"}
                    breakLabel={"..."}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
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
