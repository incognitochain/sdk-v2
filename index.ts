import '@src/utils/polyfill.ts';
import '@src/global';

import {
  implementGoMethodManually,
  implementGoMethodUseWasm,
  GO_METHOD_NAMES,
} from '@src/go';
import { setPrivacyUtilRandomBytesFunc } from '@src/services/wallet';
import * as _CONSTANT from '@src/constants/constants';
import * as _TX_CONSTANT from '@src/constants/tx';
import * as _WALLET_CONSTANT from '@src/constants/wallet';
import * as HISTORY_CONSTANT from '@src/constants/history';
import _TOKEN_INFO_CONSTANT from '@src/constants/tokenInfo';
import { checkPaymentAddress } from '@src/services/key';
export { default as AccountInstance } from '@src/walletInstance/account/account';
export { default as NativeTokenInstance } from '@src/walletInstance/token/nativeToken';
export { default as PrivacyTokenInstance } from '@src/walletInstance/token/privacyToken';
export { default as WalletInstance } from '@src/walletInstance/wallet';
export { default as MasterAccount } from '@src/walletInstance/account/masterAccount';
export { default as KeyWalletModel } from '@src/models/key/keyWallet';
export { default as AccountKeySetModel } from '@src/models/key/accountKeySet';
export { default as PaymentInfoModel } from '@src/models/paymentInfo';
export { default as storageService } from '@src/services/storage';
export { default as mnemonicService } from '@src/services/wallet/mnemonic';
export { default as TxHistoryModel } from '@src/models/txHistory';
export * from '@src/models/txHistory';
export { setConfig, getConfig } from '@src/config';
export { getPrivacyTokenList } from '@src/services/bridge/token';
export { default as rpcClient } from '@src/services/rpc';

import * as historyBridgeServices from '@src/services/bridge/history';
import * as depositBridgeServices from '@src/services/bridge/deposit';
import * as tokenBridgeServices from '@src/services/bridge/token';
import * as withdrawBridgeServices from '@src/services/bridge/withdraw';

import * as txHistoryServices from '@src/services/history/txHistory';

export const historyServices = {
  ...txHistoryServices,
};

export const bridgeServices = {
  ...historyBridgeServices,
  ...depositBridgeServices,
  ...withdrawBridgeServices,
  ...tokenBridgeServices,
};

export const walletServices = {
  setPrivacyUtilRandomBytesFunc,
};

export const goServices = {
  implementGoMethodManually,
  implementGoMethodUseWasm,
  GO_METHOD_NAMES,
};

export const keyServices = {
  checkPaymentAddress,
};

export const CONSTANT = {
  ..._CONSTANT,
  TX_CONSTANT: _TX_CONSTANT,
  WALLET_CONSTANT: _WALLET_CONSTANT,
  TOKEN_INFO_CONSTANT: _TOKEN_INFO_CONSTANT,
  HISTORY: HISTORY_CONSTANT.HISTORY,
};
