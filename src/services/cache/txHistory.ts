import storage from '@src/services/storage';
import KEYS from '@src/constants/keys';
import _ from 'lodash';
import TxHistoryModel from '@src/models/txHistory';
import Validator from '@src/utils/validator';

interface TxHistoryCache {
  [txId: string]: TxHistoryModel;
}

export async function getTxHistoryCache() {
  const prevCached: { [txId: string]: object } =
    (await storage.get(KEYS.TX_HISTORY_CACHE)) || {};
  const txIds = Object.keys(prevCached);
  const data: TxHistoryCache = {};
  txIds.forEach((txId) => {
    const historyData: { [key: string]: any } = prevCached[txId];
    data[txId] = new TxHistoryModel({
      txId: historyData.txId,
      txType: historyData.txType,
      lockTime: historyData.lockTime,
      status: historyData.status,
      nativeTokenInfo: historyData.nativeTokenInfo,
      privacyTokenInfo: historyData.privacyTokenInfo,
      meta: historyData.meta,
      accountPublicKeySerialized: historyData.accountPublicKeySerialized,
      historyType: historyData.historyType,
    });
  });
  return data;
}

export async function cacheTxHistory(txId: string, history: TxHistoryModel) {
  new Validator('txId', txId).string().required();
  new Validator('history', history).required();
  const prevCached = await getTxHistoryCache();
  const txIds = Object.keys(prevCached);
  const data: { [key: string]: object } = {};
  txIds.forEach((txId) => {
    data[txId] = prevCached[txId].toJson();
  });
  data[txId] = history.toJson();
  storage.set(KEYS.TX_HISTORY_CACHE, data);
}
