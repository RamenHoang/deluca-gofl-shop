import React from 'react';
import filterAPI from '../../apis/filterAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const FilterRating = (props) => {

  const [loader, showLoader, hideLoader] = useFullPageLoader();

  let handleFilter = (star) => {
    showLoader();
    filterAPI.filterRating(props.cateId, { star: star }).then(res => {
      props.handleFilter(res.data.data);
      hideLoader();
    }).catch(err => {
      hideLoader();
      console.log(err);
    });
  }

  return (
    <div className="item-filter">
      <h6>ĐÁNH GIÁ</h6>
      <div className="rating-list">
        <a href="# " onClick={() => handleFilter(5)}>
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <span className="text">5 sao</span>
        </a>
        <a href="# " onClick={() => handleFilter(4)} >
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star" />
          <span className="text">trên 4 sao</span>
        </a>
        <a href="# " onClick={() => handleFilter(3)}>
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star " />
          <i className="fa fa-star " />
          <span className="text">trên 3 sao</span>
        </a>
        <a href="# " onClick={() => handleFilter(2)}>
          <i className="fa fa-star active" />
          <i className="fa fa-star active" />
          <i className="fa fa-star " />
          <i className="fa fa-star " />
          <i className="fa fa-star " />
          <span className="text">trên 2 sao</span>
        </a>
      </div>
      <hr /> 
      { loader }
    </div>
  )
}

export default FilterRating;
