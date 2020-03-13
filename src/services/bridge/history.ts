import http from './bridgeHttp';
import Validator from '@src/utils/validator';
import BridgeHistoryModel from '@src/models/bridge/bridgeHistory';

export const getBridgeHistory = ({ paymentAddress, tokenId }: { paymentAddress: string, tokenId: string }) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();

  return http.get('eta/history', {
    params: {
      WalletAddress: paymentAddress,
      PrivacyTokenAddress: tokenId
    }
  }).then((res: any) => {
    return res && res?.map((history: any) => new BridgeHistoryModel(history));
  });
};

export const removeBridgeHistory = ({ historyId, currencyType, isDecentralized }: { historyId: number, currencyType: number, isDecentralized: boolean }) => {
  new Validator('historyId', historyId).required().number();
  new Validator('currencyType', currencyType).required().number();
  new Validator('isDecentralized', isDecentralized).required().boolean();

  return http.post('eta/remove', {
    CurrencyType: currencyType,
    ID: historyId,
    Decentralized: Number(isDecentralized)
  });
};