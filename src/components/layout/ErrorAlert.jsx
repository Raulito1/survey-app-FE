import React from 'react';

import { Alert, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/react';

const ErrorAlert = ({ message, onClose }) => {
    return (
        <Alert status='error' variant='solid'>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            {message}
            <CloseButton position='absolute' right='8px' top='8px' onClick={onClose} />
        </Alert>
    );
};

export default ErrorAlert;
