import React from 'react';
import filterAPI from '../../apis/filterAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const FilterPrice = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  let handleClick = (range) => {
    showLoader();
    filterAPI.filterPrice(props.cateId, { range: range }).then(res => {
      hideLoader();
      props.handleFilter(res.data.data);
    });
  }

  return (
    <div className="item-filter">
      <h6>GIÁ</h6>
      <div>
        <div><span className="badge" onClick={() => handleClick("max-50")} > Dưới 50.000 ₫</span></div>
        <div><span className="badge" onClick={() => handleClick("from-50-to-150")} > Từ 50.000 ₫ đến 150.000 ₫</span></div>
        <div><span className="badge" onClick={() => handleClick("min-150")} > Trên 150.000 ₫</span></div>
      </div>
      <hr />
      { loader}
    </div>
  )
}

export default FilterPrice;
