import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import { CustomTokenInit } from '@src/tx/constants';
import { createTx } from './sendPrivacyToken';

interface TokenInfo {
  tokenSymbol: TokenSymbolType,
  tokenName: TokenNameType,
};

interface InitParam extends TokenInfo {
  accountKeySet: AccountKeySetModel,
  avaiableCoins: CoinModel[],
  nativeFee: number,
  supplyAmount: number,
};

export async function inPrivacyToken({
  accountKeySet,
  avaiableCoins,
  nativeFee,
  tokenSymbol,
  tokenName,
  supplyAmount
} : InitParam) {
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: accountKeySet.paymentAddressKeySerialized,
      amount: supplyAmount,
      message: ''
    })
  ];
  const tokenId = <string>null;
  const nativePaymentInfoList = <PaymentInfoModel[]>[];
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(0);
  const privacyPaymentAmountBN = getTotalAmountFromPaymentList(privacyPaymentInfoList);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, avaiableCoins, nativePaymentAmountBN, nativeTokenFeeBN);

  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN);
  console.log('privacyTxInput', privacyTxInput);

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN,
    nativePaymentAmountBN,
    privacyTxInput,
    privacyPaymentInfoList,
    privacyTokenFeeBN,
    privacyPaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    tokenId,
    tokenSymbol,
    tokenName,
    privacyTokenParamAdditional: {
      amount: supplyAmount,
      tokenTxType: CustomTokenInit,
    },
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTxCustomTokenPrivacy, txInfo.b58CheckEncodeTx);

  // const historyInfo = createHistoryInfo({ ...sentInfo, lockTime: txInfo.lockTime });

  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  const { serialNumberList: privacySpendingCoinSNs, listUTXO: privacyListUTXO } = getCoinInfoForCache(privacyTxInput.inputCoinStrs);
  
  return {
    sentInfo,
    nativeSpendingCoinSNs,
    nativeListUTXO,
    privacySpendingCoinSNs,
    privacyListUTXO
  };
}