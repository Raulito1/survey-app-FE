import { Flex, Spinner } from '@chakra-ui/react';

const CenteredSpinner = () => {
    return (
        <Flex height='100vh' alignItems='center' justifyContent='center'>
            <Spinner size='xl' />
        </Flex>
    );
};

export default CenteredSpinner;
