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
        console.debug('Fetching response...', { url });
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
        console.debug(
          `Error catched: ${err instanceof Error && err.message
            ? err.message
            : 'Something went wrong!'}`,
        );
        setError(`Something went wrong... ${err instanceof Error && err.message}`);
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
