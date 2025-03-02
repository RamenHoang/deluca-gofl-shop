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
    <div className="container mt-5">
      <div className="row">
        <h2>Danh mục ưu đãi.</h2>
        <h2 style={{color: "#4B5563CC"}}>&nbsp;Deluca giá tốt nhất dành cho bạn</h2>
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

export default DiscountProducts;
