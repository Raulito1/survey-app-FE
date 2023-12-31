import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, Text, VStack } from '@chakra-ui/react';
import Title from './layout/Title';

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Container maxW='xl' centerContent>
            <VStack spacing={8} py={12}>
                <Title title='The Survey App' />
                <Text fontSize='xl' textAlign='center'>
                    Participate in surveys, share your opinion, and view results
                </Text>
                <Box>
                <Button 
                    colorScheme='blue' 
                    size='lg' 
                    onClick={() => loginWithRedirect()}
                >
                    Log In to Get Started
                </Button>
                </Box>
            </VStack>
        </Container>
    );
};

export default Login;
