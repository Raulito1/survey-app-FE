import { useLocation } from 'react-router-dom';

export const usePageType = () => {
    const location = useLocation();

    if (location.pathname.includes('/delete-survey')) return 'delete';
    if (location.pathname.includes('/edit-survey')) return 'edit';
    if (location.pathname.includes('/refresh-survey')) return 'refresh';

    return 'default';
};
