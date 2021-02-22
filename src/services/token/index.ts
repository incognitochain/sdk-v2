import { getConfig } from '@src/config';
import {
  getAllOutputCoins,
  deriveSerialNumbers,
  getValueFromCoins,
} from '@src/services/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import rpc from '@src/services/rpc';
import { getTxHistoryCache } from '../cache/txHistory';
import { TX_STATUS } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { http } from '@src/services/http';
import toUpper from 'lodash/toUpper';
import isEqual from 'lodash/isEqual';
import trim from 'lodash/trim';
import { axios } from '@src/services/http';
import createAxiosInstance from '../http/axios';
/**
 * Return list of coins that not existed in chain (not use yet)
 */
export async function getUnspentCoins(
  accountKeySet: AccountKeySetModel,
  tokenId?: string
) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('tokenId', tokenId).string();
  const allCoins = await getAllOutputCoins(accountKeySet, tokenId);
  const derivedCoins = await deriveSerialNumbers(accountKeySet, allCoins);
  const coins = derivedCoins.coins;
  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const serialNumberList = coins?.map((coin) => coin.serialNumber) || [];
  const serialNumberStatus = await rpc.hasSerialNumber(
    paymentAddress,
    serialNumberList, //list serial number (serial number of a bill)
    tokenId
  );
  return coins?.filter((coin, index) => !serialNumberStatus[index]); //check a bill spent:true  or unspent: false
}

/**
 * Coins can use to create tx (excluding spent coins, spending coins)
 * TODO: method check spending bill. Current we only check unspent bill.
 */
export async function getAvailableCoins(
  accountKeySet: AccountKeySetModel,
  tokenId: string,
  isNativeCoin: boolean
) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('tokenId', tokenId).string();
  new Validator('isNativeCoin', isNativeCoin).boolean();
  const unspentCoins = await getUnspentCoins(accountKeySet, tokenId);
  // const spendingSerialNumberData = await getSpendingSerialCoins();
  // const spendingSerialNumbers = isNativeCoin
  //   ? spendingSerialNumberData.spendingNativeSerialNumbers
  //   : spendingSerialNumberData.spendingPrivacySerialNumbers;
  return unspentCoins;
  // return unspentCoins.filter(
  //   (coin) => !spendingSerialNumbers.includes(coin.serialNumber)
  // );
}

/**
 * List of serial numbers are being use
 */
export async function getSpendingSerialCoins(): Promise<{
  spendingNativeSerialNumbers: string[];
  spendingPrivacySerialNumbers: string[];
}> {
  const caches = await getTxHistoryCache();
  const txHistories = Object.values(caches);

  const spendingNativeSerialNumbers: string[] = [];
  const spendingPrivacySerialNumbers: string[] = [];

  txHistories.forEach((txHistory) => {
    if (
      txHistory.status !== TX_STATUS.CONFIRMED &&
      txHistory.status !== TX_STATUS.FAILED
    ) {
      spendingNativeSerialNumbers.push(
        ...(txHistory.nativeTokenInfo.spendingCoinSNs || [])
      );
      spendingPrivacySerialNumbers.push(
        ...(txHistory.privacyTokenInfo.spendingCoinSNs || [])
      );
    }
  });

  return {
    spendingNativeSerialNumbers,
    spendingPrivacySerialNumbers,
  };
}

export function getTotalBalance(unspentCoins: CoinModel[]) {
  new Validator('unspentCoins', unspentCoins).required().array();
  return getValueFromCoins(unspentCoins);
}

export function getAvailableBalance(availableCoins: CoinModel[]) {
  new Validator('availableCoins', availableCoins).required().array();
  return getValueFromCoins(availableCoins);
}

export const detectERC20Token = (erc20Address: string) => {
  new Validator('erc20Address', erc20Address).required().string();
  return http
    .post('eta/detect-erc20', {
      Address: erc20Address,
    })
    .then((res: any) => ({
      symbol: res?.Symbol || '',
      name: res?.Name || '',
    }))
    .catch((error: any) => error);
};

let BEP2Tokens: any[] = [];

export const getBEP2Token = () => {
  const axios = createAxiosInstance({
    baseURL: getConfig().dexBinanceApiURL,
  });
  return axios.get('tokens?limit=100000').then((res: any) => res);
};

export const detectBEP2Token = async (symbol: string) => {
  new Validator('symbol', symbol).required().string();
  if (BEP2Tokens.length === 0) {
    const results: any[] = await getBEP2Token();
    BEP2Tokens = [...results].map((item: any) => ({
      symbol: item?.original_symbol || item?.symbol || '',
      name: item?.name || '',
    }));
  }
  return BEP2Tokens.find((item) =>
    isEqual(toUpper(trim(item.originalSymbol)), toUpper(trim(symbol)))
  );
};
