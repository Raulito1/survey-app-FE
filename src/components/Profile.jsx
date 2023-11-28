import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Image, Text, Flex, Heading } from '@chakra-ui/react';

const Profile = () => {
    const { user } = useAuth0();

    return user ? (
        <Flex align="center" justify="center" p={5}>
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="lg">
                <Flex align="center" justify="center">
                    <Image 
                        borderRadius="full"
                        boxSize="100px"
                        src={user.picture}
                        alt={user.name}
                        mb={4}
                    />
                </Flex>
                <Heading as="h3" size="lg" textAlign="center" mb={2}>{user.name}</Heading>
                {user.email && <Text fontSize="md" color="gray.500" textAlign="center">{user.email}</Text>}
            </Box>
        </Flex>
    ) : null;
};

export default Profile;
