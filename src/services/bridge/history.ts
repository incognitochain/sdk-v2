import Validator from '@src/utils/validator';
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

export const getBridgeHistoryById = ({
  id,
  currencyType,
}: {
  id: number;
  currencyType: number;
}) => {
  new Validator('id', id).required().number();
  new Validator('currencyType', currencyType).required().number();
  return http
    .get(`eta/history/detail/${id}`, {
      params: {
        ID: id,
        CurrencyType: currencyType,
      },
    })
    .then((res: any) => res);
};

const bridgeServices = {
  getBridgeHistory,
  retryBridgeHistory,
  removeBridgeHistory,
  getBridgeHistoryById,
};

export default bridgeServices;
