import { TxHistoryModel } from "@src/models/txHistory";
import rpc from "../rpc";
import { getTxHistoryCache, cacheTxHistory } from "../cache/txHistory";
import { TX_STATUS } from "@src/constants/tx";

export async function updateTxHistory(txHistory: TxHistoryModel) {
  const txInfo: { [key:string]: any } = await rpc.getTransactionByHash(txHistory.txId);

  if (txInfo?.isInBlock) {
    // tx completed
    txHistory.status = TX_STATUS.CONFIRMED;
  } else if (!txInfo.isInBlock && !txInfo.isInMempool && txInfo.err !== null) {
    // tx failed
    txHistory.status = TX_STATUS.FAILED;
  }

  return txHistory;
}

export async function checkCachedHistories() {
  const cached = await getTxHistoryCache();
  const txIds = Object.keys(cached);

  const tasks = txIds.map(async txId => {
    const txHistory = cached[txId];
    const updatedTxHistory = await updateTxHistory(txHistory);
    
    return cacheTxHistory(txId, updatedTxHistory).catch(null);
  });
  return Promise.all(tasks).then(() => true);
}

/**
 * 
 * @param tokenId Use `null` for native token
 */
export async function getTxHistoryByPublicKey(accountPublicKeySerialized: string, tokenId?: string) {
  const cached = await getTxHistoryCache();
  return Object.values(cached).filter(txHistory => {
    const matchPublicKey = txHistory.accountPublicKeySerialized === accountPublicKeySerialized;

    if (matchPublicKey) {
      const txTokenId = txHistory.privacyTokenInfo.tokenId;

      // search for privacy token history
      if (tokenId) {
        const matchTokenId = txTokenId === tokenId;

        return matchTokenId ? true : false;
      } else { // search for native token history
        return txTokenId ? false : true;
      }
    }   
    return false; 
  }) || [];
}