import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from 'format-currency';
import commentAPI from '../../apis/commentAPI';

const ItemBook = ({ info }) => {
  const [rate, setRate] = useState({});
  useEffect(() => {
    commentAPI.rateAverageOfBook(info._id).then(res => {
      setRate(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }, [info._id]);

  let rating = (star) => {
    let rows = []
    for (let i = 0; i < star; i++) {
      rows = [...rows,  <li key={i} className="active"><i className="fa fa-star" /></li>];
    }
    for (let j = star; j < 5; j++) {
      rows = [...rows,  <li key={j} ><i className="fa fa-star" /></li>];
    }
    return rows;
  }

  return (
    <div className="card">
      <Link to={`/categories/${info.category.c_slug}.html?pid=${info._id}&p_slug=${info.p_slug}`} className="motsanpham" style={{ textDecoration: 'none', color: 'black' }} data-toggle="tooltip" data-placement="bottom" title={info.p_name}>
        <img className="card-img-top anh" src={ info.p_image_detail.url } alt="item book" />
        <div className="card-body noidungsp mt-3">
          <h3 className="card-title ten">{ info.p_name }</h3>
          <small className="tacgia text-muted">
            { info.author.map((v, i) => {
              return (
                <span key={i}>
                  { `${v.a_name}  -` } 
                </span>
              )
            }) }
          </small>
          <div className="gia d-flex align-items-baseline">
            <div className="giamoi">{ formatCurrency(info.p_promotion) } ₫</div>
            <div className="giacu text-muted">{ formatCurrency(info.p_price) } ₫</div>
          </div>
          <div className="danhgia">
            <ul className="d-flex" style={{ listStyle: 'none' }}>
              {
                rating(Math.ceil(rate.rateAverage))
              }
              <li><span className="text-muted">{ rate.countComment } nhận xét</span></li>
            </ul>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ItemBook
