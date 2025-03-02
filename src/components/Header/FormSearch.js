import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import searchIcon from "./../../assets/images/search-icon.png";

const FormSearch = () => {
  const history = useHistory();
  const [query, setQuery] = useState("");

  let handleSubmitSearch = (e) => {
    e.preventDefault();
    history.push({ pathname: "/search", search: "?query=" + query });
    setQuery("");
  };

  return (
    <form
      className="form-inline ml-auto my-2 my-lg-0 mr-3"
      onSubmit={handleSubmitSearch}
    >
      <div className="input-group" style={{ width: "400px", height: "52px", borderRadius: "30px", borderImage: "none" }}>
        <div className="input-group-prepend">
          <button
            type="submit"
            className="btn"
            style={{ color: "white", borderRadius: "30px 0 0 30px", backgroundColor: "#F8F8F8" }}
          >
            <img src={searchIcon} alt="Search Icon" style={{ width: "20px", height: "20px" }} />
          </button>
        </div>
        <input
          type="text"
          className="form-control"
          aria-label="Small"
          placeholder="Nhập từ khóa cần tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderRadius: "0 30px 30px 0", backgroundColor: "#F8F8F8", height: "52px" }}
        />
      </div>
    </form>
  );
};

export default FormSearch;
