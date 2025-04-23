import React, { useEffect, useState } from "react";
import ItemBook from "../../components/ItemBook/ItemBook";
import homeAPI from './../../apis/homeAPI';
import "./DiscountProducts.css";
import { successToast } from "../../components/Toasts/Toasts";
import useFullPageLoader from "../../hooks/useFullPageLoader";

const NewBook = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(8);

  useEffect(() => {
    showLoader();
    homeAPI.getNewBooks(page, productsPerPage).then((res) => {
      if (res.data.data.length > 0) {
        setProducts(res.data.data); // Replace products instead of appending
        
        // Set total pages based on API response
        setTotalPages(Math.ceil(res.data.total));
      } else if (page > 1) {
        // If no products returned but we're not on page 1, go back to page 1
        setPage(1);
        successToast("Không tìm thấy sản phẩm, hiển thị trang đầu tiên.");
      }
      hideLoader();
    }).catch((err) => {
      console.log(err);
      hideLoader();
    });
  }, [page, productsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({
        top: document.querySelector(".new-products").offsetTop - 200,
        behavior: "smooth"
      });
    }
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
    <div className="container mt-5 discount-products new-products">
      <div className="d-flex justify-content-start">
        <h2 className="title-1">Best Sellers.</h2>
        <h2 className="title-2" style={{color: "#4B5563CC"}}>Sản phẩm được ưa chuộng nhất trong tháng</h2>
      </div>
      <div className="row">
        {products.map((product, index) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
            <ItemBook info={product} />
          </div>
        ))}
      </div>
      {loader}
      {products.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default NewBook;