import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { createTx } from './sendNativeToken';
import { PDEContributionMeta } from '@src/constants/wallet';
import { TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface ContributionParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  pdeContributionPairID: string,
  contributedAmount: number,
  tokenId: TokenIdType
};

export default async function sendNativeTokenPdeContribution({
  accountKeySet,
  availableNativeCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  pdeContributionPairID,
  tokenId,
  contributedAmount,
} : ContributionParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('nativeFee', nativeFee).required().amount;
  new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
  new Validator('tokenId', tokenId).required().string();
  new Validator('contributedAmount', contributedAmount).required().amount();

  const usePrivacyForNativeToken = false;
  const nativeFeeBN = toBNAmount(nativeFee);
  const contributedAmountBN = toBNAmount(contributedAmount);
  const burningAddress = await getBurningAddress();
  const nativePaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: burningAddress,
      amount: contributedAmountBN.toNumber(),
      message: ''
    })
  ];
  
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);

  console.log('nativeTxInput', nativeTxInput);

  const metaData =  {
    PDEContributionPairID: pdeContributionPairID,
    ContributorAddressStr: accountKeySet.paymentAddressKeySerialized,
    ContributedAmount: contributedAmount,
    TokenIDStr: tokenId,
    Type: PDEContributionMeta
  };
  
  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initPRVContributionTx,
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
    historyType: HISTORY_TYPE.PDE_CONTRIBUTION_NATIVE_TOKEN
  });
}