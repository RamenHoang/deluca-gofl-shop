import React, { useEffect, useState } from "react";
import ItemBook from "../../components/ItemBook/ItemBook";
import homeAPI from './../../apis/homeAPI';
import "./DiscountProducts.css";

const NewBook = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    homeAPI.getNewBooks().then((res) => {
      setProducts(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="container mt-5 discount-products">
      <div className="d-flex justify-content-start">
        <h2 className="title-1">Best Sellers.</h2>
        <h2 className="title-2" style={{color: "#4B5563CC"}}>Sản phẩm được ưa chuộng nhất trong tháng</h2>
      </div>
      <div className="row">
        {products.map((product, index) => (
          <div className="col-6 col-md-4 col-lg-3  mb-4" key={index}>
            <ItemBook info={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBook;
