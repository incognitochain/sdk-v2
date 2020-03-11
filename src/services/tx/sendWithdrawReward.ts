import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { createTx } from './sendNativeToken';
import { WithDrawRewardRequestMeta } from '@src/constants/wallet';
import { TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import Validator from '@src/utils/validator';

interface WithdrawRewardParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  tokenId: TokenIdType
};

export default async function sendWithdrawReward({
  accountKeySet,
  availableNativeCoins,
  tokenId
} : WithdrawRewardParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('tokenId', tokenId).required().string();

  const usePrivacyForNativeToken = false;
  const nativeFeeBN = toBNAmount(0);
  const nativePaymentInfoList: PaymentInfoModel[] = [];
  
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);

  console.log('nativeTxInput', nativeTxInput);

  const metaData = {
    Type: WithDrawRewardRequestMeta,
    PaymentAddress: accountKeySet.paymentAddressKeySerialized,
    TokenID: tokenId
  };
  
  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initWithdrawRewardTx,
    metaData
  });
  
  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);
  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee: nativeFeeBN.toNumber(),
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs,
    txType: TX_TYPE.NORMAL,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    meta: metaData,
    historyType: HISTORY_TYPE.WITHDRAW_REWARD
  });
}