import { useToast } from '@chakra-ui/react';

const NotificationToast = () => {
    const toast = useToast();

    const showToast = ({ title, description, status }) => {
        toast({
            title,
            description,
            status,
            duration: 9000,
            isClosable: true,
            position: 'top-right',
        });
    };

    return { showToast };
};

export default NotificationToast;
