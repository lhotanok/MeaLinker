import { useState, useCallback } from 'react';

type RequestConfig = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, any>;
};

export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (requestConfig: RequestConfig, processDataFn: (data: any) => void) => {
      setIsLoading(true);
      setError(null);

      const { url, method = 'GET', headers = {} } = requestConfig;
      const body = requestConfig.body
        ? JSON.stringify(requestConfig.body) as BodyInit
        : null;

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
        processDataFn(data);
      } catch (err) {
        console.log(`Error catched: ${JSON.stringify(err)}`);
        if (err instanceof Error) {
          setError(err.message || 'Something went wrong!');
        }
      }

      setIsLoading(false);
    },
    [],
  );

  return {
    isLoading,
    error,
    sendRequest,
  };
}
