import CoinModel from "@src/models/coin";
import storage from '@src/services/storage';
import KEYS from '@src/constants/keys';
import _ from "lodash";
import { TxHistoryModel } from "@src/models/txHistory";

interface TxHistoryCache {
  [txId: string]: TxHistoryModel,
};

export async function getTxHistoryCache() {
  const prevCached: {[txId: string]: object} = await storage.get(KEYS.TX_HISTORY_CACHE) || {};
  const txIds = Object.keys(prevCached);
  const data: TxHistoryCache = {};

  txIds.forEach(txId => {
    const historyData: {[key: string]: any} = prevCached[txId];
    data[txId] = new TxHistoryModel({
      txId: historyData.txId,
      txType: historyData.txType,
      lockTime: historyData.lockTime,
      status: historyData.status,
      nativeTokenInfo: historyData.nativeTokenInfo,
      privacyTokenInfo: historyData.privacyTokenInfo,
      meta: historyData.meta,
      accountPublicKeySerialized: historyData.accountPublicKeySerialized
    });
  });

  return data;
}

export async function cacheTxHistory(txId: string, history: TxHistoryModel) {
  const prevCached = await getTxHistoryCache();
  const txIds = Object.keys(prevCached);
  const data: {[key: string]: object} = {};

  txIds.forEach(txId => {
    data[txId] = prevCached[txId].toJson();
  });

  data[txId] = history.toJson();

  storage.set(KEYS.TX_HISTORY_CACHE, data);
}