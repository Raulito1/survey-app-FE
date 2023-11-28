// src/components/Profile.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user } = useAuth0();

    return user ? <div>Hello {user.name}</div> : null;
};

export default Profile;
