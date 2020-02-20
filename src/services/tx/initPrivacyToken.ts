import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import wasmMethods from '@src/wasm/methods';
import { CustomTokenInit, TxCustomTokenPrivacyType } from '@src/services/tx/constants';
import { createTx } from './sendPrivacyToken';

interface TokenInfo {
  tokenSymbol: TokenSymbolType,
  tokenName: TokenNameType,
};

interface InitParam extends TokenInfo {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  supplyAmount: number,
};

export default async function initPrivacyToken({
  accountKeySet,
  availableNativeCoins,
  nativeFee,
  tokenSymbol,
  tokenName,
  supplyAmount
} : InitParam) {
  const usePrivacyForPrivacyToken = false;
  const usePrivacyForNativeToken = true;
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: accountKeySet.paymentAddressKeySerialized,
      amount: supplyAmount,
      message: ''
    })
  ];
  const tokenId = <string>'';
  const nativePaymentInfoList = <PaymentInfoModel[]>[];
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(0);
  const privacyPaymentAmountBN = toBNAmount(0);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);
  const privacyAvailableCoins: CoinModel[] = [];

  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, privacyAvailableCoins, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN, usePrivacyForPrivacyToken);
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
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    initTxMethod: wasmMethods.initPrivacyTokenTx,
    privacyTokenParamAdditional: {
      amount: supplyAmount,
      tokenTxType: CustomTokenInit,
    },
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTxCustomTokenPrivacy, txInfo.b58CheckEncodeTx);

  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs,
    tokenSymbol,
    tokenName,
    tokenId: txInfo.tokenID,
    txType: TxCustomTokenPrivacyType,
    privacyTokenTxType: CustomTokenInit,
    privacyPaymentInfoList,
    privacyPaymentAmount: supplyAmount,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    usePrivacyForPrivacyToken,
    devInfo: 'issue token'
  });
}