import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import wasmMethods from '@src/wasm/methods';
import { TxCustomTokenPrivacyType, CustomTokenTransfer } from '@src/services/tx/constants';
import { extractInfoFromInitedTxBytes as customExtractInfoFromInitedTxBytes } from '@src/services/tx/sendNativeToken';
import { createTx } from './sendPrivacyToken';
import { PDEContributionMeta, PDETradeRequestMeta } from '../wallet/constants';

interface ContributionParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  tradingFee: number,
  sellAmount: number,
  tokenIdBuy: TokenIdType,
  minimumAcceptableAmount: number,
  privacyAvailableCoins: CoinModel[],
  privacyFee: number,
  tokenId: TokenIdType,
  tokenName: TokenNameType,
  tokenSymbol: TokenSymbolType,
};

export default async function sendPrivacyTokenPdeTradeRequest({
  accountKeySet,
  availableNativeCoins,
  privacyAvailableCoins,
  tradingFee,
  sellAmount,
  minimumAcceptableAmount,
  nativeFee,
  privacyFee,
  tokenId,
  tokenName,
  tokenSymbol,
  tokenIdBuy
} : ContributionParam) {
  const usePrivacyForPrivacyToken = false;
  const usePrivacyForNativeToken = false;
  const nativePaymentInfoList = <PaymentInfoModel[]>[];
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(privacyFee);
  const tradingFeeBN = toBNAmount(tradingFee);
  const sellAmountBN = toBNAmount(sellAmount);
  const minimumAcceptableAmountBN = toBNAmount(minimumAcceptableAmount);
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: await getBurningAddress(),
      amount: sellAmountBN.add(tradingFeeBN).toNumber(),
      message: ''
    })
  ];
  const privacyPaymentAmountBN = getTotalAmountFromPaymentList(privacyPaymentInfoList);
  
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);

  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, privacyAvailableCoins, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN, usePrivacyForPrivacyToken);
  console.log('privacyTxInput', privacyTxInput);

  const metaData = {
    TokenIDToBuyStr: tokenIdBuy,
    TokenIDToSellStr: tokenId,
    SellAmount: sellAmountBN.toNumber(),
    TraderAddressStr: accountKeySet.paymentAddressKeySerialized,
    Type: PDETradeRequestMeta,
    MinAcceptableAmount: minimumAcceptableAmountBN.toNumber(),
    TradingFee: tradingFeeBN.toNumber()
  };

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
    initTxMethod: wasmMethods.initPTokenTradeTx,
    metaData,
    privacyTokenParamAdditional: {
    },
    customExtractInfoFromInitedTxMethod: customExtractInfoFromInitedTxBytes
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTxCustomTokenPrivacy, txInfo.b58CheckEncodeTx);

  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  const { serialNumberList: privacySpendingCoinSNs, listUTXO: privacyListUTXO } = getCoinInfoForCache(privacyTxInput.inputCoinStrs);

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
    tokenId,
    txType: TxCustomTokenPrivacyType,
    privacyTokenTxType: CustomTokenTransfer,
    privacyPaymentInfoList,
    privacyPaymentAmount: privacyPaymentAmountBN.toNumber(),
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    usePrivacyForPrivacyToken,
    privacySpendingCoinSNs,
    privacyListUTXO,
    meta: metaData,
    privacyFee,
    devInfo: 'privacy token trade request'
  });
}