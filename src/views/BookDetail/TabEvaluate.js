import React, { useEffect, useState } from 'react';
import getCookie from '../../utils/getCookie';
import img from './../../assets/images/male.png';
import Evaluate from './Evaluate';
import homeAPI from './../../apis/homeAPI';
import commentAPI from '../../apis/commentAPI';
import formatDate from './../../utils/formatDate';

const token = getCookie('authUserToken');

const TabEvaluate = (props) => {
  const [comments, setComments] = useState([]);
  const [average, setAverage] = useState({});
  const [percentRate, setPercentRate] = useState([]);

  useEffect(() => {

    if (props.book !== undefined) {
      //get all comment of book
      homeAPI.getAllCommentsOfBook(props.book).then(res => {
        setComments(res.data.data);

      }).catch(err => {
        console.log(err);
      });

      //get rateAverage and count evaluate, percentRate
      commentAPI.rateAverageOfBook(props.book).then((res) => {
        setAverage(res.data.data);
        setPercentRate(res.data.data.percentRate);
      }).catch(err => {
        console.log(err);
      })
    }

  }, [props.book]);

  let addNewComments = (data) => {
    setComments([data, ...comments]);
  }

  let rate = (star) => {
    let rows = []
    for (let i = 0; i < star; i++) {
      rows = [...rows, <i key={i} className="fa fa-star active" />];
    }
    for (let j = star; j < 5; j++) {
      rows = [...rows, <i key={j} className="fa fa-star" />];
    }
    return rows;
  }

  return (
    <div className="tab-pane fade" id="nav-danhgia" role="tabpanel" aria-labelledby="nav-danhgia-tab">
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 col-md-3 text-center">
            <p className="tieude">Đánh giá trung bình</p>
            <div className="diem"> {average.rateAverage ? average.rateAverage : 0} /5</div>
            <div className="sao">
              {rate(Math.ceil(average.rateAverage))}
            </div>
            <p className="sonhanxet text-muted">({average ? average.countComment : 0} nhận xét)</p>
          </div>

          <div className="col-7 col-md-7">
            <div className="tiledanhgia text-center">
              {percentRate.map((v, i) => {
                return (
                  <div key={i} className="motthanh d-flex align-items-center">{ v.star } <i className="fa fa-star"></i>
                    <div className="progress mx-2">
                      <div className="progress-bar" role="progressbar" style={{ width: v.percent + '%', background: '#F7A623' }} aria-valuenow={v.percent} aria-valuemin={0} aria-valuemax={100}></div>
                    </div> { v.percent } %
                  </div>
                )
              })}
              {token !== '' ? (<Evaluate bookId={props.book} newComments={addNewComments} />) :
                (<div data-toggle="modal" data-target="#formdangnhap" className="btn vietdanhgia mt-3 nutdangnhap">Đăng nhập để đánh giá sản phẩm</div>)}

            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="container comment-list">

            {comments.map((v, i) => {
              return (
                <div className="row comment-item" key={i} >
                  <div className="col-2 col-md-1 comment-avatar">
                    <img src={img} alt="avatar-user" />
                  </div>
                  <div className="col-10 col-md-11">
                    <h6>{v.user.username}</h6>
                    <div className="rating-list">

                      {rate(v.c_rate)}

                    </div>
                    <div className="comment-text">
                      {v.c_content}
                    </div>
                    <div className="comment-date">
                      Nhận xét lúc: { formatDate(v.createdAt) }
                     
                    </div>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>
    </div>
  )
}

export default TabEvaluate;
