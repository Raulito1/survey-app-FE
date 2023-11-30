import { useEffect, useState } from 'react';

// Redux hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux actions
import { clearError } from '../store/slices/errorSlice';

// Custom components
import ErrorAlert from '../components/layout/ErrorAlert';

const useErrorAlert = () => {
    const [showAlert, setShowAlert] = useState(false);
    const error = useSelector((state) => state.error.error);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            setShowAlert(true);
        }
    }, [error, dispatch]);

    const handleClose = () => {
        setShowAlert(false);
        dispatch(clearError());
    };

    return showAlert ? <ErrorAlert message={error} onClose={handleClose} /> : null;
};

export default useErrorAlert;
