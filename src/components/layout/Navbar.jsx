import React from 'react';

// React Router
import { useLocation, Link } from 'react-router-dom';

// Auth0 hook
import { useAuth0 } from '@auth0/auth0-react';

// Chakra UI Components
import {
    Box,
    Flex,
    Text,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
} from '@chakra-ui/react';

const Navbar = ({ user }) => {
    const { logout } = useAuth0();
    const location = useLocation();
    const isHome = location.pathname === '/survey-list'; 

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
    };

    return (
        <Flex bg="blue.500" color="white" px={4} py={3} alignItems="center">
        <Box p="2">
            <Text fontSize="xl" fontWeight="bold">The Survey App</Text>
        </Box>
        <Spacer />
        {user && (
            <>
            <Text fontSize="md" mr={4}>Welcome, {user.name || user.nickname}</Text>
            <Menu>
                <MenuButton as={Avatar} size="sm" name={user.name || user.nickname} src={user.picture} cursor="pointer" />
                <MenuList bg="white" color="black">
                    {!isHome && (
                        <MenuItem as={Link} to="/survey-list" _hover={{ bg: "blue.500", color: "white" }}>
                            Go to Home
                        </MenuItem>
                    )}
                    <MenuItem _hover={{ bg: "blue.500", color: "white" }} onClick={handleLogout}>
                        Logout
                    </MenuItem>
                </MenuList>

            </Menu>
            </>
        )}
        </Flex>
    );
};

export default Navbar;
