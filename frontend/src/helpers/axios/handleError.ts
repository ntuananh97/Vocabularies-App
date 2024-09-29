import axios from 'axios';

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // When response status code is not in 2xx
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message);
    } else if (error.request) {
      // When no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server.');
    }
  }
  // Error occurred while setting up the request
  console.error('Unexpected error:', error);
  throw new Error('Unexpected error occurred.');
};
