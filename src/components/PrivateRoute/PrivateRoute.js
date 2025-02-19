import React from 'react';
import getCookie from './../../utils/getCookie';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {

  const token = getCookie('authUserToken');

  return (
    <Route
      {...rest}
      render={(props) => (
        token ? (
          <Layout {...props} {...rest}>
            <Component {...props} {...rest} />
          </Layout>
        ) : (<Redirect to="/" />)
      )}
    />
  )
}

export default PrivateRoute;
