export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || data.error || 'Bad Request';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return data.message || 'Server error. Please try again later.';
      default:
        return data.message || `Error ${status}: ${data.error || 'Something went wrong'}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

export const showErrorToast = (message) => {
  // Simple toast implementation - you can replace with a proper toast library
  console.error(message);
  alert(message); // Fallback to alert for now
};