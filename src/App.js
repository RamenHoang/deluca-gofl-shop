import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Client from "./layouts/Client";
import Account from "./views/Account/Account";
import BookDetail from "./views/BookDetail/BookDetail";
import Cart from "./views/Cart/Cart";
import CategoryDetail from "./views/CategoryDetail/CategoryDetail";
import Home from "./views/Home/Home";
import Order from "./views/Order/Order";
import OrderDetail from "./views/OrderDetail/OrderDetail";
import TrackingOrder from "./views/TrackingOrder/TrackingOrder";
import Search from "./views/Search/Search";
import About from "./views/About/About";
import Posts from "./views/Posts/Posts";
import PostDetail from "./views/Posts/PostDetail";

const App = () => {
  useEffect(() => {}, []);

  const [totalItem, setTotalItem] = useState(
    localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).totalQuantity
      : 0
  );

  let countTotalItem = (childData) => {
    setTotalItem(childData);
  };

  return (
    <Router>
      <Switch>
        <PublicRoute
          exact
          path="/"
          component={Home}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/about"
          component={About}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/posts"
          component={Posts}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/posts/:id"
          component={PostDetail}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/cart"
          component={Cart}
          layout={Client}
          totalItem={countTotalItem}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/search"
          component={Search}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/categories"
          component={CategoryDetail}
          layout={Client}
          cntItem={totalItem}
        />
        <PublicRoute
          exact
          path="/categories/:c_slug"
          component={BookDetail}
          layout={Client}
          totalItem={countTotalItem}
          cntItem={totalItem}
        />
        <PrivateRoute
          exact
          path="/account"
          component={Account}
          layout={Client}
          cntItem={totalItem}
        />
        <PrivateRoute
          exact
          path="/orders/history"
          component={Order}
          layout={Client}
          cntItem={totalItem}
        />
        <PrivateRoute
          exact
          path="/orders/view/:code"
          component={OrderDetail}
          layout={Client}
          cntItem={totalItem}
        />
        <PrivateRoute
          exact
          path="/orders/tracking/:code"
          component={TrackingOrder}
          layout={Client}
          cntItem={totalItem}
        />
      </Switch>
    </Router>
  );
};

export default App;
