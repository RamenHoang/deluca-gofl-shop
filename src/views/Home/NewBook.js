import React, { useEffect, useState } from "react";
import ItemBook from "../../components/ItemBook/ItemBook";
import homeAPI from './../../apis/homeAPI';
import "./DiscountProducts.css";
import { successToast } from "../../components/Toasts/Toasts";

const NewBook = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    homeAPI.getNewBooks(page).then((res) => {
      if (res.data.data.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...res.data.data]);
      } else {
        setHasMore(false);
        successToast("Đã hiển thị tất cả sản phẩm.");
      }
    }).catch((err) => {
      console.log(err);
    });
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container mt-5 discount-products">
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
      {hasMore && (
        <div className="text-center mt-4">
          <button className="btn btn-primary load-more-btn" onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default NewBook;