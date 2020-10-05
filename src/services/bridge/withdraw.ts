import http from './bridgeHttp';
import { TokenInfo } from '@src/constants';
import Validator from '@src/utils/validator';

export const genCentralizedWithdrawAddress = ({ amount, paymentAddress, walletAddress, tokenId, currencyType, memo } : {
  amount: string, paymentAddress: string, walletAddress: string, tokenId: string, currencyType: number, memo?: string
}): Promise<string> => {
  new Validator('amount', amount).required().number().largerThan(0);
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('memo', memo).string();

  return http.post('ota/generate', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: amount,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
    ...memo ? { Memo: memo } : {}
  }).then((res: any) => res?.Address);
};

export const addETHTxWithdraw = ({ amount, originalAmount, paymentAddress, walletAddress, tokenId, burningTxId, currencyType  } : {
  amount: string, paymentAddress: string, walletAddress: string, tokenId: string, currencyType: number, originalAmount: string, burningTxId: string
}) => {
  new Validator('amount', amount).required().number().largerThan(0);
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('burningTxId', burningTxId).required().string();
  new Validator('originalAmount', originalAmount).required().amount().largerThan(0);

  return http.post('eta/add-tx-withdraw', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: amount,
    IncognitoAmount: originalAmount,
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId,
    IncognitoTx: burningTxId,
    WalletAddress: walletAddress ?? paymentAddress,
  });
};

export const addERC20TxWithdraw = ({ amount, originalAmount, paymentAddress, walletAddress, tokenContractID, tokenId, burningTxId, currencyType  } : {
  amount: string, paymentAddress: string, walletAddress: string, tokenId: string, currencyType: number, originalAmount: string, burningTxId: string, tokenContractID: string
}) => {
  new Validator('amount', amount).required().number().largerThan(0);
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('burningTxId', burningTxId).required().string();
  new Validator('tokenContractID', tokenContractID).required().string();
  new Validator('originalAmount', originalAmount).required().amount().largerThan(0);

  return http.post('eta/add-tx-withdraw', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: amount,
    IncognitoAmount: originalAmount,
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    IncognitoTx: burningTxId,
    WalletAddress: walletAddress ?? paymentAddress,
  });
};

export const updatePTokenFee = ({ fee, paymentAddress  }: { fee: string, paymentAddress: string }) => {
  new Validator('fee', fee).required().amount().largerThan(0);
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();

  return http.post('ota/update-fee', {
    Address: paymentAddress,
    TokenFee: fee,
  });
};
