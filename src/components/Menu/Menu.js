import React, { useEffect, useState } from 'react';
import homeAPI from './../../apis/homeAPI';
import { Link } from 'react-router-dom';

const Menu = (props) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    homeAPI.getAllCategories().then((res) => {
      setCategories(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="categorycontent">
      <ul>
        {categories.map((v, i) => {
          return (
            <li key={i}>
              <Link to={`/categories?cateid=${v._id}&c_slug=${v.c_slug}`} >{v.c_name}</Link><i className="fa fa-chevron-right float-right" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Menu;
