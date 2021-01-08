import storage from '@src/services/storage';
import KEYS from '@src/constants/keys';
import _ from 'lodash';
import TxHistoryModel from '@src/models/txHistory';
import Validator from '@src/utils/validator';
import { base64Decode } from '@src/privacy/utils';
import PaymentInfoModel from '@src/models/paymentInfo';

interface TxHistoryCache {
  [txId: string]: TxHistoryModel;
}

const decodePaymentInfoList = (paymentInfoList: PaymentInfoModel[]) => {
  return paymentInfoList
    ? paymentInfoList.map((info) => ({
        ...info,
        message: base64Decode(info.message),
      }))
    : [];
};

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
      nativeTokenInfo: {
        ...historyData.nativeTokenInfo,
        paymentInfoList: decodePaymentInfoList(
          historyData.nativeTokenInfo?.paymentInfoList
        ),
      },
      privacyTokenInfo: {
        ...historyData.privacyTokenInfo,
        paymentInfoList: decodePaymentInfoList(
          historyData.privacyTokenInfo?.paymentInfoList
        ),
      },
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
