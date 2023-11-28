import React from 'react';
import { Box, Flex, Text, Spacer } from '@chakra-ui/react';

const Navbar = () => {
    return (
        <Flex bg="blue.500" color="white" px={4} py={3} alignItems="center">
            <Box p="2">
                <Text fontSize="xl" fontWeight="bold">The Survey App</Text>
            </Box>
            <Spacer />
            {/* Add additional Navbar items here if needed */}
        </Flex>
    );
};

export default Navbar;
