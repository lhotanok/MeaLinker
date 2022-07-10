export type RequestConfig = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, any>;
};
