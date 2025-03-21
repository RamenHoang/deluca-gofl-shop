/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import ItemBook from './../../components/ItemBook/ItemBook';
import homeAPI from '../../apis/homeAPI';
import ReactPaginate from 'react-paginate';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Search = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const [offSet, setOffSet] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [books, setBooks] = useState([]);
  useEffect(() => {
    showLoader();
    homeAPI.searchBooks(queryString.parse(props.location.search).query).then(res => {
      let data = res.data.data;
      let slice = data.slice(offSet, offSet + perPage);

      hideLoader();
      setBooks(slice);
      setPageCount(Math.ceil(data.length / perPage));
      // setBooks(res.data.data);
    }).catch(err => {
      hideLoader();
      console.log(err);
    })
  }, [props.location.search]);

  let handlePageClick = (e) => {
    let selectedPage = e.selected;
    let offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffSet(offset);
    showLoader();
    homeAPI.searchBooks(queryString.parse(props.location.search).query).then((res) => {
      let data = res.data.data;
      let slice = data.slice(offset, offset + perPage);

      setBooks(slice);
      setPageCount(Math.ceil(data.length / perPage));
      hideLoader();
    }).catch((err) => {
      hideLoader();
      console.log(err);
    });
  }

  return (
    <>
      <section className="breadcrumbbar">
        <div className="container">
          <ol className="breadcrumb mb-0 p-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/" >Trang chủ</Link></li>
            <li className="breadcrumb-item active"><a href="# ">Tìm kiếm</a></li>
          </ol>
        </div>
      </section>

      <section className="content my-4">
        <div className="container">
          <div className="noidung bg-white" style={{ width: '100%' }}>
            <div className="header-khoi-sp d-flex justify-content-between py-2">
              <h5 className="pt-2 pl-2">Kết quả tìm kiếm với từ khóa `{queryString.parse(props.location.search).query}` </h5>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="items">
                <div className="row">

                  {books.map((v, i) => {
                    return (
                      <div className="col-lg-3 col-md-4 col-xs-6 item DeanGraziosi" key={i}>
                        <ItemBook info={v} />
                      </div>
                    )
                  })}

                </div>
              </div>
            </div>
          </div>

          <div className="pagination-bar my-3">
            <div className="row">
              <div className="col-12 ">
                <ReactPaginate
                  previousLabel={"← Prev"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
      { loader }
    </>
  )
}

export default Search;
