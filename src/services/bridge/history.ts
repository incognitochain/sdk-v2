import { http } from '@src/services/http';

export const getBridgeHistory = (payload: any) =>
  http
    .get('eta/history', {
      params: payload,
    })
    .then((res: any) => res || []);

export const retryBridgeHistory = (payload: any) =>
  http.post('eta/retry', payload).then((res: any) => res);

export const removeBridgeHistory = (payload: any) =>
  http.post('eta/remove', payload).then((res: any) => res);
