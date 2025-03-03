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
    <div className="container mt-5">
      <div className="row">
        <h2>Best Sellers.</h2>
        <h2 style={{color: "#4B5563CC"}}>&nbsp;Sản phẩm được ưa chuộng nhất trong tháng</h2>
      </div>
      <div className="row">
        {products.map((product, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
            <ItemBook info={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBook;
