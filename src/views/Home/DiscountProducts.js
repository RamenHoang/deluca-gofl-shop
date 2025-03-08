import React, { useEffect, useState } from "react";
import ItemBook from "../../components/ItemBook/ItemBook";
import homeAPI from './../../apis/homeAPI';
import "./DiscountProducts.css";

const DiscountProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    homeAPI.getDiscountProducts().then((res) => {
      setProducts(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className="container mt-5 discount-products">
      <div className="d-flex justify-content-start">
        <h2 className="title-1">Danh mục ưu đãi.</h2>
        <h2 className="title-2" style={{color: "#4B5563CC"}}>Deluca giá tốt nhất dành cho bạn</h2>
      </div>
      <div className="row">
        {products.map((product, index) => (
          <div className="col-6 col-md-4 col-lg-3" key={index}>
            <ItemBook info={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountProducts;
