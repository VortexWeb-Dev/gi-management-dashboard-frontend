import axios from 'axios';

async function fetchData(url, config = {}, setIsLoading=null, setError=null) {
  setIsLoading && setIsLoading(true)
  try {
    const response = await axios.get(url, config);
    setError && setError(null)
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error('Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // No response received after the request was made
      console.error('No response received:', error.request);
    } else {
      // Something else caused the error
      console.error('Error setting up request:', error.message);
    }

    // Optionally throw the error again or return a custom error object
    setError && setError(error)
    // throw error;
  } finally {
    setIsLoading && setIsLoading(false)
  }
}

export default fetchData