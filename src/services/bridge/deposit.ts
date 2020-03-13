import http from './apiHttp';
import Validator from '@src/utils/validator';
import TokenInfo from '@src/constants/tokenInfo';

interface CentralizedDepositParam {
  paymentAddress: string;
  walletAddress: string;
  tokenId: string;
  currencyType: number;
};

type ETHDepositParam = CentralizedDepositParam;

interface ERC20DepositParam extends ETHDepositParam {
  tokenContractID: string;
}

export const genCentralizedDepositAddress = ({ paymentAddress, walletAddress, tokenId, currencyType }: CentralizedDepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();

  return http.post('ota/generate', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    PrivacyTokenAddress: tokenId,
  }).then((res: any) => res?.Address);
};

export const genETHDepositAddress = ({ paymentAddress, walletAddress, tokenId, currencyType }: ETHDepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();

  return http.post('eta/generate', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId
  }).then((res: any) => res?.Address);
};

export const genERC20DepositAddress = ({ paymentAddress, walletAddress, tokenId, tokenContractID, currencyType }: ERC20DepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('tokenContractID', tokenContractID).required().string();

  return http.post('eta/generate', {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId
  }).then((res: any) => res?.Address);
};