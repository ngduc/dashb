import axios, { AxiosInstance } from 'axios';
import useSWR from 'swr';
import qs from 'query-string';
import { UI_API_BASE } from './constants';
import { getLS } from './appUtils';

// v6: 2023-11: fixed getAuthHeader, params.headers;
// v5: 2023-10: add options for apiPost, apiDelete; add getAuthHeader;
// v4: 2023-09: in url: use '@' for UI_API_BASE
// v3: 2022-03: use SWR, useFetch hook
// v2: 2022-01: added ApiParams, cache.
// alternative: use whatwg-fetch: https://github.com/ngduc/ui-base-next/blob/master/src/utils/Req.ts

const cache: any = {}; // cache for GET api calls { [apiCallUrl + queryStr]: { content, createdAt, TTL } }
const buildQueryString = (queryObj: any) => (queryObj ? '?' + qs.stringify(queryObj) : '');

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});

function getAuthHeader(params?: ApiParams) {
  const token = getLS('tk', '', false);
  if (!token || params?.noAuth === true) {
    return {};
  }
  return {
    authorization: `Bearer ${token}`,
    ...(params?.options?.headers ?? {})
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dummyFetch(mockData = []) {
  await sleep(1000);
  return mockData;
}

const catchError = (err: any) => {
  console.error('catchError', err, err?.response);
  return { error: { message: typeof err === 'object' ? err?.message : err }, status: err?.response?.status };
};

interface ApiParams {
  query?: any;
  payload?: any;
  options?: any;
  noCache?: boolean;
  noAuth?: boolean;
  [key: string]: any;
}

// path, { query, options }
export const apiGet = async (path: string, params?: ApiParams) => {
  const queryStr = buildQueryString(params?.query);
  let url = `${path}${queryStr}`;
  url = url.startsWith('@') ? url.replace(/@/, UI_API_BASE) : url;

  if (cache[url] && params?.noCache !== true) {
    return cache[url].content;
  }
  try {
    const { data, status } = await axiosApi({
      url: path.startsWith('http') ? path : url,
      method: 'GET',
      headers: path.startsWith('http') ? {} : getAuthHeader(params),
      ...params?.options
    });
    cache[url] = { content: { data, status } }; // cache output
    return { data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    if (status === 401) {
      return { error: new Error('Unauthorized'), status };
    }
    return { error, status };
  }
};

export const apiPost = async (path: string, params?: ApiParams) => {
  const queryStr = buildQueryString(params?.query);
  let url = `${path}${queryStr}`;
  url = url.startsWith('@') ? url.replace(/@/, UI_API_BASE) : url;
  try {
    const { data, status } = await axiosApi({
      url,
      method: 'POST',
      headers: path.startsWith('http') ? {} : getAuthHeader(params),
      data: params?.payload,
      ...params?.options
    });

    return { data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);

    return { error, status };
  }
};

export const apiDelete = async (path: string, params?: ApiParams) => {
  const queryStr = buildQueryString(params?.query);
  let url = `${path}${queryStr}`;
  url = url.startsWith('@') ? url.replace(/@/, UI_API_BASE) : url;
  try {
    const obj = {
      url,
      method: 'DELETE',
      headers: path.startsWith('http') ? {} : getAuthHeader(params),
      ...params?.options
    };
    // console.log('obj', obj);
    const { data, status } = await axiosApi(obj);
    return { data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    return { error, status };
  }
};

// helper fn for 'useFetch'
export const swrFetch = async (path: string) => {
  const { data, error } = await apiGet(path);
  if (error) {
    throw new Error('Error completing request');
  }
  return data;
};

// useFetch - example: const { data, error, isLoading } = useFetch<User[]>(`https://fakerapi.it/api/v1/persons`);
interface useFetchParams {
  query?: any;
  swrOptions?: any;
  [key: string]: any;
}
export function useFetch<T>(path: string, params: useFetchParams = {}) {
  const queryStr = buildQueryString(params?.query);
  let url = `${path}${queryStr}`;
  url = url.startsWith('@') ? url.replace(/@/, UI_API_BASE) : url;

  const { data, error } = useSWR(url, swrFetch, params?.swrOptions || {});
  return {
    data: error ? null : (data?.data as T),
    isLoading: !error && !data,
    isError: !!error,
    error
  };
}
