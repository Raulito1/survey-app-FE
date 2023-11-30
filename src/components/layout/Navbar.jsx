import React from 'react';

// React Router
import { useLocation, Link } from 'react-router-dom';

// Auth0 hook
import { useAuth0 } from '@auth0/auth0-react';

// reduc slice
import { useSelector } from 'react-redux';

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
    const userRoles = useSelector(state => state.auth.roles);
    const isAdmin = userRoles.includes('ADMIN');


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
                    {isAdmin && (
                        <>
                            <MenuItem as={Link} to="/create-survey" _hover={{ bg: "blue.500", color: "white" }}>
                                Create a Survey
                            </MenuItem>
                            <MenuItem as={Link} to="/edit-survey" _hover={{ bg: "blue.500", color: "white" }}>
                                Edit a Survey
                            </MenuItem>
                            <MenuItem as={Link} to="/delete-survey" _hover={{ bg: "blue.500", color: "white" }}>
                                Delete a Survey
                            </MenuItem>
                            <MenuItem as={Link} to="/refresh-survey" _hover={{ bg: "blue.500", color: "white" }}>
                                Refresh a Survey
                            </MenuItem>
                        </>
                        
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
