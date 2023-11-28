import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const PrivateRoute = ({ component, ...args }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <div>Loading...</div>,
    });

    return <Component {...args} />;
};

export default PrivateRoute;
