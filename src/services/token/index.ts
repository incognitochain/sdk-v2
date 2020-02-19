import { getAllOutputCoins, deriveSerialNumbers, getValueFromCoins } from '@src/services/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import rpc from '@src/services/rpc';
import { getTxHistoryCache } from '../cache/txHistory';
import { ConfirmedTx, FailedTx } from '../wallet/constants';

/**
 * Return list of coins that not existed in chain (not use yet)
 */
export async function getUnspentCoins(accountKeySet: AccountKeySetModel, tokenId: string) {
  const allCoins = await getAllOutputCoins(accountKeySet, tokenId);
  const derivedCoins = await deriveSerialNumbers(accountKeySet, allCoins);
  const coins = derivedCoins.coins;
  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const serialNumberList = coins?.map(coin => coin.serialNumber) || [];
  const serialNumberStatus =  await rpc.hasSerialNumber(paymentAddress, serialNumberList, tokenId);

  return coins?.filter((coin, index) => !serialNumberStatus[index]);

}

/**
 * Coins can use to create tx (excluding spent coins, spending coins)
 */
export async function getAvailableCoins(accountKeySet: AccountKeySetModel, tokenId: string, isNativeCoin: boolean) {
  const unspentCoins = await getUnspentCoins(accountKeySet, tokenId);
  const spendingSerialNumberData = await getSpendingSerialCoins();
  const spendingSerialNumbers = isNativeCoin ? spendingSerialNumberData.spendingNativeSerialNumbers : spendingSerialNumberData.spendingPrivacySerialNumbers;
  
  return unspentCoins.filter(coin => !spendingSerialNumbers.includes(coin.serialNumber));
}

/**
 * List of serial numbers are being use
 */
export async function getSpendingSerialCoins() : Promise<{spendingNativeSerialNumbers: string[], spendingPrivacySerialNumbers: string[]}> {
  const caches = await getTxHistoryCache();
  const txHistories = Object.values(caches);

  const spendingNativeSerialNumbers: string[] = [];
  const spendingPrivacySerialNumbers: string[] = [];

  txHistories.forEach(txHistory => {
    if (txHistory.status !== ConfirmedTx && txHistory.status !== FailedTx) {
      spendingNativeSerialNumbers.push(...txHistory.nativeTokenInfo.spendingCoinSNs || []);
      spendingPrivacySerialNumbers.push(...txHistory.privacyTokenInfo.spendingCoinSNs || []);
    }
  });

  return {
    spendingNativeSerialNumbers,
    spendingPrivacySerialNumbers
  };
}

export function getTotalBalance(unspentCoins: CoinModel[]) {
  return getValueFromCoins(unspentCoins);
}

export function getAvailableBalance(availableCoins: CoinModel[]) {
  return getValueFromCoins(availableCoins);
}