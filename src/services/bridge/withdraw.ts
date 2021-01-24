import { http } from '@src/services/http';
import { TokenInfo } from '@src/constants';
import Validator from '@src/utils/validator';

export const checkValidAddress = ({
  address,
  currencyType,
}: {
  address: string;
  currencyType: number;
}) => {
  new Validator('address', address).required().string();
  new Validator('currencyType', currencyType).required().number();
  return http
    .get(`ota/valid/${currencyType}/${address}`)
    .then((res: any) => res);
};

// Withdraw centralized:
// Step 1: Check valid address
// Gen temp withdraw address (included master address in user fees)
// Withdraw pToken pay fee by PRV
// Step 2: Send a tx include
// + Tx send incognito amount to temp address
// + User fee (PRV) to master address
// + Fee burn (= fee create tx) for api burn temp address
// Step 3: Send success -> save tx update centralized pToken fee to local
// Step 4: Call update centralized pToken fee

// Withdraw pToken pay fee by pToken

// gen temp address + get user fee
export const estUserFeeCentralizedWithdraw = ({
  incognitoAmount,
  requestedAmount,
  paymentAddress,
  walletAddress,
  tokenId,
  currencyType,
  memo,
  signPublicKey = '',
}: {
  incognitoAmount: string;
  requestedAmount: string;
  paymentAddress: string;
  walletAddress: string;
  tokenId: string;
  currencyType: number;
  memo?: string;
  signPublicKey?: string;
}): Promise<string> => {
  new Validator('incognitoAmount', incognitoAmount).required().amount();
  new Validator('requestedAmount', requestedAmount).required().string();
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('memo', memo).string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: requestedAmount,
    IncognitoAmount: incognitoAmount,
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
    ...(memo ? { Memo: memo } : {}),
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Estimate user fees centralized', payload);
  return http.post('ota/generate', payload).then((res: any) => res);
};

// update token fee
export const centralizedWithdraw = ({
  privacyFee,
  nativeFee,
  address,
  userFeeSelection,
  userFeeLevel,
  incognitoTxToPayOutsideChainFee,
  signPublicKey = '',
}: {
  privacyFee: string;
  nativeFee: string;
  address: string;
  userFeeSelection: number;
  userFeeLevel: number;
  incognitoTxToPayOutsideChainFee: string;
  signPublicKey?: string;
}) => {
  new Validator('privacyFee', privacyFee).amount();
  new Validator('nativeFee', nativeFee).amount();
  new Validator('address', address).required().string();
  new Validator('userFeeSelection', userFeeSelection).required().number();
  new Validator('userFeeLevel', userFeeLevel).required().number();
  new Validator(
    'incognitoTxToPayOutsideChainFee',
    incognitoTxToPayOutsideChainFee
  )
    .required()
    .string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    Address: address, //temp address
    PrivacyFee: nativeFee,
    TokenFee: privacyFee,
    ID: '',
    UserFeeSelection: userFeeSelection,
    UserFeeLevel: userFeeLevel,
    IncognitoTxToPayOutsideChainFee: incognitoTxToPayOutsideChainFee, //txId of incognito tx withdraw
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Withdraw centralized', payload);
  return http.post('ota/update-fee', payload).then((res: any) => res);
};

// Withdraw decentralized:
// Step 1: Check valid address
// Step 2: Get master address by estimate decentralized withdraw fees (user fees)
// Step 3: Create burn tx from local
// Step 4: Save tx burn to local
// Step 5: Decentralized withdraw by tx

export const decentralizedWithdraw = ({
  incognitoAmount,
  requestedAmount,
  paymentAddress,
  walletAddress,
  tokenId,
  incognitoTx,
  currencyType,
  erc20TokenAddress,
  id,
  userFeeSelection,
  userFeeLevel,
  signPublicKey = '',
}: {
  incognitoAmount: string;
  requestedAmount: string;
  paymentAddress: string;
  walletAddress: string;
  tokenId: string;
  currencyType: number;
  incognitoTx: string;
  erc20TokenAddress?: string;
  id: string;
  userFeeSelection: number;
  userFeeLevel: number;
  signPublicKey?: string;
}) => {
  new Validator('incognitoAmount', incognitoAmount).required().amount();
  new Validator('requestedAmount', requestedAmount).required().string();
  new Validator('erc20TokenAddress', erc20TokenAddress).string();
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('walletAddress', walletAddress).required().paymentAddress();
  new Validator('tokenId', tokenId).required().string();
  new Validator('currencyType', currencyType).required().number();
  new Validator('incognitoTx', incognitoTx).required().string();
  new Validator('id', id).required().number();
  new Validator('userFeeSelection', userFeeSelection).required().number();
  new Validator('userFeeLevel', userFeeLevel).required().number();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: requestedAmount,
    IncognitoAmount: incognitoAmount,
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: erc20TokenAddress || '', //contract id
    PrivacyTokenAddress: tokenId,
    IncognitoTx: incognitoTx, // burn tx id
    WalletAddress: walletAddress, // account payment address
    ID: id, // user fee id
    UserFeeSelection: userFeeSelection, // 1: privacy fee; 2: token fee
    UserFeeLevel: userFeeLevel, // 1 or 2
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Withdraw decentralized', payload);
  return http.post('eta/add-tx-withdraw', payload).then((res: any) => res);
};

//get user fee
export const estUserFeeDecentralizedWithdraw = ({
  tokenId,
  requestedAmount,
  currencyType,
  incognitoAmount,
  paymentAddress,
  walletAddress,
  erc20TokenAddress = '',
  signPublicKey = '',
}: {
  tokenId: string;
  requestedAmount: string;
  currencyType: number;
  incognitoAmount: string;
  paymentAddress: string;
  walletAddress: string;
  erc20TokenAddress?: string;
  signPublicKey?: string;
}) => {
  new Validator('tokenId', tokenId).string().required();
  new Validator('incognitoAmount', incognitoAmount).required().amount();
  new Validator('requestedAmount', requestedAmount).amount().required();
  new Validator('currencyType', currencyType).number().required();
  new Validator('paymentAddress', paymentAddress).string().required();
  new Validator('walletAddress', walletAddress).paymentAddress().required();
  new Validator('erc20TokenAddress', erc20TokenAddress).string();
  new Validator('signPublicKey', signPublicKey).string();
  const payload = {
    TokenID: tokenId,
    RequestedAmount: requestedAmount,
    CurrencyType: currencyType,
    AddressType: TokenInfo.BRIDGE_PRIVACY_TOKEN.ADDRESS_TYPE.WITHDRAW,
    IncognitoAmount: incognitoAmount,
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: erc20TokenAddress,
    PrivacyTokenAddress: tokenId,
    WalletAddress: walletAddress,
    IncognitoTx: '',
    SignPublicKeyEncode: signPublicKey,
  };
  L.info('Estimate user fees decentralized', payload);
  return http.post('eta/estimate-fees', payload).then((res: any) => res);
};
