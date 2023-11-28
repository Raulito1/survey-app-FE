import React, { Component } from 'react';
import { connect } from 'react-redux';
import setError from '../store/slices/errorSlice';

// Chakra UI Components
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.props.setError(`${error}: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{this.props.errorMessage || 'Something went wrong.'}</AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  errorMessage: state.error.message,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (message) => dispatch(setError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
