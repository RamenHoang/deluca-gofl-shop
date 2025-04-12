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
  const [totalPages, setTotalPages] = useState(1);
  const [booksPerPage] = useState(9); // Set books per page

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // window.scrollTo(0, 0);
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
      .getBooksByCateIds([...selectedCategories], minPrice, maxPrice, page, booksPerPage)
      .then((res) => {
        if (res.data.data.length > 0) {
          setBooks(res.data.data); // Replace books instead of appending
          setShowNotFound(false);
          setShouldSelect(false);
          
          // Calculate total pages if total count is available in the response
          // Assuming the API returns totalCount in the response
          if (res.data.total) {
            setTotalPages(Math.ceil(res.data.total));
          }
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

  // Create pagination controls
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Calculate range of visible page numbers
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${page === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          &laquo;
        </button>
      </li>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        pages.push(<li key="ellipsis1" className="page-item disabled"><span className="page-link">...</span></li>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<li key="ellipsis2" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        </li>
      );
    }

    // Next button
    pages.push(
      <li key="next" className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          &raquo;
        </button>
      </li>
    );

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {pages}
        </ul>
      </nav>
    );
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
            <div className="row">
              <div className="col-12 col-md-3 col-sm-3">
                <FilterCategory
                  categories={subCategories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  setPage={setPage}
                  setBooks={setBooks}
                  setHasMore={setTotalPages}
                />

                <FilterPrice
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  setPage={setPage}
                  setBooks={setBooks}
                  setHasMore={setTotalPages}
                />
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
                  {books.length > 0 && totalPages > 1 && (
                    <div className="mt-4">
                      {renderPagination()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader}
      </section>
    </>
  );
};

export default CategoryDetail;
