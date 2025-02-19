import React, { useState } from "react";
import { useHistory } from "react-router-dom";

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
      <div className="input-group" style={{ width: "520px" }}>
        <input
          type="text"
          className="form-control"
          aria-label="Small"
          placeholder="Nhập từ khóa cần tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="input-group-append">
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: "#f3f700", color: "white" }}
          >
            <i className="fa fa-search" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormSearch;
