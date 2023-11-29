import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logError } from '../store/slices/errorSlice'; // Import logError action

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
    // Log the error using the logError action from errorSlice
    this.props.logError(`${error}: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{this.props.error || 'Something went wrong.'}</AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  error: state.error.error, // Adjust according to the state structure in errorSlice
});

const mapDispatchToProps = {
  logError, // Use object shorthand for mapDispatchToProps
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
