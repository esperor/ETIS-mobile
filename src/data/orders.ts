import { IOrder } from '../models/order';
import { emptyResult, IGetPayload, IGetResult } from '../models/results';
import parseOrders from '../parser/order';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

export const getCachedOrders = async (): Promise<IGetResult<IOrder[]>> => {
  console.log('[DATA] Use cached orders data');
  return {
    ...emptyResult,
    data: await storage.getOrdersData(),
  };
};

export const getOrdersData = async (payload: IGetPayload): Promise<IGetResult<IOrder[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedOrders();
    if (result.data) return result;
  }

  const response = await httpClient.getOrders();

  if ((response as HTTPError).error || !response) {
    if (payload.useCache) return await getCachedOrders();
    return emptyResult;
  }

  if (isLoginPage(response as string)) return { ...emptyResult, isLoginPage: true };

  const data = parseOrders(response as string);
  console.log('[DATA] Fetched orders data');
  cacheOrdersData(data);

  return {
    data,
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheOrdersData = (data: IOrder[]) => {
  console.log('[DATA] Caching orders data...');

  storage.storeOrdersData(data);
};

export const getOrderHTML = async (order: IOrder): Promise<string> => {
  const cached = await storage.getOrderHTML(order.id);
  if (cached) {
    console.log('[DATA] Use cached order html');
    return cached;
  }

  const fetched = await httpClient.request('GET', `/${order.uri}`, { returnResponse: false });
  if ((fetched as HTTPError).error) return;

  console.log('[DATA] fetched order html');

  storage.storeOrderHTML(order.id, fetched as string);

  console.log('[DATA] cached order html');

  return fetched.data as string;
};
