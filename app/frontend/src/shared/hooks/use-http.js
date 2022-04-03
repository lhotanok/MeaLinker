import { useState, useCallback } from 'react';

export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, processDataFn) => {
    console.log(`Sending request (wrapped in useCallback)`);
    setIsLoading(true);
    setError(null);

    const { url, method = 'GET', headers = {} } = requestConfig;
    const body = requestConfig.body ? JSON.stringify(requestConfig.body) : null;

    try {
      console.log('Fetching response...');
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();
      // console.log(`Fetched data: ${JSON.stringify(data, null, 2)}`);
      processDataFn(data);
    } catch (err) {
      console.log(`Error catched: ${JSON.stringify(err)}`);
      setError(err.message || 'Something went wrong!');
    }

    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
}
