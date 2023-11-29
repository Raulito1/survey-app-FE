import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import CenteredSpinner from './layout/CenteredSpinner';

const PrivateRoute = ({ component, ...args }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <div><CenteredSpinner /></div>,
    });

    return <Component {...args} />;
};

export default PrivateRoute;
