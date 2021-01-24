import Validator from '@src/utils/validator';
import { http } from '@src/services/http';

export const getBridgeHistory = ({
  walletAddress,
  tokenId,
  signPublicKey = '',
}: {
  walletAddress: string;
  tokenId: string;
  signPublicKey?: string;
}) => {
  new Validator('walletAddress', walletAddress).required().string();
  new Validator('tokenId', tokenId).required().string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Get bridge history', payload);
  return http
    .get('eta/history', {
      params: payload,
    })
    .then((res: any) => res || []);
};

export const retryBridgeHistory = ({
  id,
  decentralized,
  walletAddress,
  addressType,
  currencyType,
  userPaymentAddress,
  privacyTokenAddress,
  erc20TokenAddress,
  outChainTx,
  signPublicKey = '',
}: {
  id: number;
  decentralized: number;
  walletAddress: string;
  addressType: number;
  currencyType: number;
  userPaymentAddress: string;
  privacyTokenAddress: string;
  erc20TokenAddress: string;
  outChainTx: string;
  signPublicKey?: string;
}) => {
  new Validator('id', id).required().number();
  new Validator('decentralized', decentralized).required().number();
  new Validator('walletAddress', walletAddress).required().string();
  new Validator('addressType', addressType).required().number();
  new Validator('currencyType', currencyType).required().number();
  new Validator('userPaymentAddress', userPaymentAddress).required().string();
  new Validator('privacyTokenAddress', privacyTokenAddress).required().string();
  new Validator('erc20TokenAddress', erc20TokenAddress).string();
  new Validator('outChainTx', outChainTx).string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    ID: id,
    Decentralized: decentralized,
    WalletAddress: walletAddress,
    AddressType: addressType,
    CurrencyType: currencyType,
    PaymentAddress: userPaymentAddress,
    PrivacyTokenAddress: privacyTokenAddress,
    Erc20TokenAddress: erc20TokenAddress,
    TxOutchain: outChainTx,
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Retry bridge history', payload);
  return http.post('eta/retry', payload).then((res: any) => res);
};

export const removeBridgeHistory = ({
  id,
  currencyType,
  decentralized,
  signPublicKey = '',
}: {
  id: number;
  currencyType: number;
  decentralized: number;
  signPublicKey?: string;
}) => {
  const payload = {
    ID: id,
    CurrencyType: currencyType,
    Decentralized: decentralized,
    SignPublicKeyEncode: signPublicKey,
  };
  new Validator('id', id).required().number();
  new Validator('decentralized', decentralized).required().number();
  new Validator('currencyType', currencyType).required().number();
  new Validator('signPublicKey', signPublicKey).string();
  L.info('Remove bridge history', payload);
  return http.post('eta/remove', payload).then((res: any) => res);
};

export const getBridgeHistoryById = ({
  id,
  currencyType,
  signPublicKey = '',
  decentralized,
}: {
  id: number;
  currencyType: number;
  signPublicKey?: string;
  decentralized: number;
}) => {
  const payload = {
    ID: id,
    CurrencyType: currencyType,
    SignPublicKeyEncode: signPublicKey,
    Decentralized: decentralized,
  };
  new Validator('id', id).required().number();
  new Validator('currencyType', currencyType).required().number();
  new Validator('decentralized', decentralized).required().number();
  new Validator('signPublicKey', signPublicKey).string();
  L.info('Get bridge history by id', payload);
  return http.post(`eta/history/detail`, payload).then((res: any) => res);
};
