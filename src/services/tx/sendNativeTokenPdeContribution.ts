import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import wasmMethods from '@src/wasm/methods';
import { TxNormalType } from '@src/services/tx/constants';
import { createTx } from './sendNativeToken';
import { PDEContributionMeta } from '../wallet/constants';

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
  nativeFee,
  pdeContributionPairID,
  tokenId,
  contributedAmount,
} : ContributionParam) {
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
    initTxMethod: wasmMethods.initPRVContributionTx,
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
    txType: TxNormalType,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    meta: metaData,
    devInfo: 'pde contribution'
  });
}