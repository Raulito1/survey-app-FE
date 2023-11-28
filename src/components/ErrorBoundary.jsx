// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import  setError  from '../store/slices/errorSlice';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.props.setError(`${error}: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return <h1>{this.props.errorMessage || 'Something went wrong.'}</h1>;
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
