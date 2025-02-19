import React from 'react';
import { Route } from 'react-router';

const PublicRoute = ({ component: Component, layout: Layout, ...rest }) => {
    return (
       <Route 
        { ...rest }
        render={(props) => (
            <Layout { ...props } {...rest}>
                <Component { ...props } {...rest} />
            </Layout>
        )}
       />
    )
}

export default PublicRoute;
