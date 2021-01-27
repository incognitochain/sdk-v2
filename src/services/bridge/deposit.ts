import { http } from '@src/services/http';
import Validator from '@src/utils/validator';
import TokenInfo from '@src/constants/tokenInfo';

interface CentralizedDepositParam {
  paymentAddress: string;
  walletAddress: string;
  tokenId: string;
  currencyType: number;
  signPublicKey?: string;
}

type ETHDepositParam = CentralizedDepositParam;

interface ERC20DepositParam extends ETHDepositParam {
  tokenContractID: string;
}

export const genCentralizedDepositAddress = ({
  paymentAddress,
  walletAddress,
  tokenId,
  currencyType,
  signPublicKey = '',
}: CentralizedDepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('signPublicKey', signPublicKey).string();
  const payload: any = {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    PrivacyTokenAddress: tokenId,
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Gen centralized deposit address', payload);
  return http.post('ota/generate', payload).then((res: any) => res?.Address);
};

export const genETHDepositAddress = ({
  paymentAddress,
  walletAddress,
  tokenId,
  currencyType,
  signPublicKey = '',
}: ETHDepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('signPublicKey', signPublicKey).string();
  const payload: any = {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: '',
    PrivacyTokenAddress: tokenId,
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Gen ETH deposit address', payload);
  return http.post('eta/generate', payload).then((res: any) => res?.Address);
};

export const genERC20DepositAddress = ({
  paymentAddress,
  walletAddress,
  tokenId,
  tokenContractID,
  currencyType,
  signPublicKey = '',
}: ERC20DepositParam) => {
  new Validator('paymentAddress', paymentAddress).required().paymentAddress();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('tokenContractID', tokenContractID).required().string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload: any = {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.DEPOSIT,
    RequestedAmount: undefined,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress ?? paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Gen ERC20 deposit address', payload);
  return http.post('eta/generate', payload).then((res: any) => res?.Address);
};

export const getMinMaxDepositAmount = () =>
  http.get('service/min-max-amount').then((res: any) => res);
