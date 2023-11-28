// src/components/LoginView.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Container maxW="xl" centerContent>
            <VStack spacing={8} py={12}>
                <Heading as="h1" size="2xl" textAlign="center">
                    Welcome to The Survey App
                </Heading>
                <Text fontSize="xl" textAlign="center">
                    Participate in surveys, share your opinion, and view results
                </Text>
                <Box>
                <Button 
                    colorScheme="blue" 
                    size="lg" 
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
