import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { createTx } from './sendNativeToken';
import { PDETradeRequestMeta } from '@src/constants/wallet';
import { TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface TradeParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: string,
  tradingFee: string,
  sellAmount: string,
  tokenIdBuy: TokenIdType,
  tokenIdSell: TokenIdType,
  minimumAcceptableAmount: string,
};

export default async function sendNativeTokenPdeTradeRequest({
  accountKeySet,
  availableNativeCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  tradingFee,
  tokenIdBuy,
  tokenIdSell,
  sellAmount,
  minimumAcceptableAmount
} : TradeParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('tradingFee', tradingFee).required().amount();
  new Validator('tokenIdBuy', tokenIdBuy).required().string();
  new Validator('tokenIdSell', tokenIdSell).required().string();
  new Validator('sellAmount', sellAmount).required().amount();
  new Validator('minimumAcceptableAmount', minimumAcceptableAmount).required().amount();

  const usePrivacyForNativeToken = false;
  const nativeFeeBN = toBNAmount(nativeFee);
  const tradingFeeBN = toBNAmount(tradingFee);
  const sellAmountBN = toBNAmount(sellAmount);
  const minimumAcceptableAmountBN = toBNAmount(minimumAcceptableAmount);
  const burningAddress = await getBurningAddress();
  const nativePaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: burningAddress,
      amount: sellAmountBN.add(tradingFeeBN).toString(),
      message: ''
    })
  ];

  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);

  console.log('nativeTxInput', nativeTxInput);

  const metaData =  {
    TokenIDToBuyStr: tokenIdBuy,
    TokenIDToSellStr: tokenIdSell,
    SellAmount: sellAmountBN.toString(),
    TraderAddressStr: accountKeySet.paymentAddressKeySerialized,
    Type: PDETradeRequestMeta,
    MinAcceptableAmount: minimumAcceptableAmountBN.toString(),
    TradingFee: tradingFeeBN.toString()
  };

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initPRVTradeTx,
    metaData
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);
  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);

  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee: nativeFeeBN.toString(),
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toString(),
    nativeSpendingCoinSNs,
    txType: TX_TYPE.NORMAL,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    meta: metaData,
    historyType: HISTORY_TYPE.PDE_TRADE_REQUEST_NATIVE_TOKEN
  });
}
