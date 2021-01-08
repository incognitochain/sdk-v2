import TxHistoryModel from '@src/models/txHistory';
import rpc from '@src/services/rpc';
import { getTxHistoryCache, cacheTxHistory } from '../cache/txHistory';
import { TX_STATUS } from '@src/constants/tx';
import Validator from '@src/utils/validator';

export async function updateTxHistory(txHistory: TxHistoryModel) {
  new Validator('txHistory', txHistory).required();
  if (txHistory.status === TX_STATUS.CONFIRMED) {
    return txHistory;
  }
  const txInfo: { [key: string]: any } = await rpc.getTransactionByHash(
    txHistory.txId
  );
  if (txInfo?.isInBlock) {
    // tx completed
    txHistory.status = TX_STATUS.CONFIRMED;
  } else if (!txInfo.isInBlock && !txInfo.isInMempool && txInfo.err !== null) {
    // tx failed
    txHistory.status = TX_STATUS.FAILED;
  }
  L.info('updateTxHistory', txInfo);
  return txHistory;
}

export async function checkCachedHistoryById(txId: string) {
  const cached = await getTxHistoryCache();
  const txHistory = cached[txId];
  const updatedTxHistory = await updateTxHistory(txHistory);
  cacheTxHistory(txId, updatedTxHistory);
  return updatedTxHistory;
}

export async function checkCachedHistories() {
  const cached = await getTxHistoryCache();
  const tasks = Object.keys(cached).map((txId) => checkCachedHistoryById(txId));
  await Promise.all(tasks);
}

/**
 *
 * @param tokenId Use `null` for native token
 */
export async function getTxHistoryByPublicKey(
  accountPublicKeySerialized: string,
  tokenId?: string
) {
  new Validator('tokenId', tokenId).string();
  new Validator('accountPublicKeySerialized', accountPublicKeySerialized)
    .required()
    .string();

  const cached = await getTxHistoryCache();
  return (
    Object.values(cached).filter((txHistory) => {
      const matchPublicKey =
        txHistory.accountPublicKeySerialized === accountPublicKeySerialized;

      if (matchPublicKey) {
        const txTokenId = txHistory.privacyTokenInfo.tokenId;

        // search for privacy token history
        if (tokenId) {
          const matchTokenId = txTokenId === tokenId;

          return matchTokenId ? true : false;
        } else {
          // search for native token history
          return txTokenId ? false : true;
        }
      }
      return false;
    }) || []
  );
}
