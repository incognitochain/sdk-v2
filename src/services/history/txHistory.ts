import TxHistoryModel, {
  IDecentralizedWithdrawData,
  ICentralizedWithdrawData,
} from '@src/models/txHistory';
import rpc from '@src/services/rpc';
import {
  getTxHistoryCache,
  cacheTxHistory,
} from '@src/services/cache/txHistory';
import { TX_STATUS } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import isEmpty from 'lodash/isEmpty';

export async function updateTxHistory(txHistory: TxHistoryModel) {
  new Validator('txHistory', txHistory).required();
  if (txHistory.status === TX_STATUS.CONFIRMED) {
    return txHistory;
  }
  try {
    const txInfo: { [key: string]: any } = await rpc.getTransactionByHash(
      txHistory.txId
    );
    if (txInfo?.IsInBlock) {
      // tx completed
      txHistory.status = TX_STATUS.CONFIRMED;
    } else if (!txInfo.IsInBlock && !txInfo.IsInMempool) {
      // tx failed
      txHistory.status = TX_STATUS.FAILED;
    }
    L.info('updateTxHistory', txHistory);
  } catch (error) {
    L.info('updateTxHistory error', txHistory);
    txHistory.status = TX_STATUS.FAILED;
  }
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

export const updateBurningDecentralizedWithdrawTxHistory = async ({
  txId,
  decentralizedWithdrawData,
}: {
  txId: string;
  decentralizedWithdrawData: IDecentralizedWithdrawData;
}) => {
  let history;
  try {
    new Validator('txId', txId).required().string();
    const cached = await getTxHistoryCache();
    if (!isEmpty(cached) && !isEmpty(cached[txId])) {
      history = cached[txId];
      history.decentralizedWithdrawData = {
        ...decentralizedWithdrawData,
        burningTxId: txId,
      };
      cacheTxHistory(txId, history);
    }
  } catch (error) {
    L.error('Cant update burning decentralized withdraw data!', error);
  }
  return history;
};

export const updateBurningCentralizedWithdrawTxHistory = async ({
  txId,
  centralizedWithdrawData,
}: {
  txId: string;
  centralizedWithdrawData: ICentralizedWithdrawData;
}) => {
  let history;
  try {
    new Validator('txId', txId).required().string();
    const cached = await getTxHistoryCache();
    if (!isEmpty(cached) && !isEmpty(cached[txId])) {
      history = cached[txId];
      history.centralizedWithdrawData = {
        ...centralizedWithdrawData,
        burningTxId: txId,
      };
      cacheTxHistory(txId, history);
    }
  } catch (error) {
    L.error('Cant update burning centralized withdraw data!', error);
  }
  return history;
};

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
