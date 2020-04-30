import { getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { createTx } from './sendNativeToken';
import { TX_TYPE, HISTORY_TYPE, MaxInputNumberForDefragment } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import { chooseCoinToDefragment, getValueFromCoins } from '../coin';
import { bn } from '@src/privacy/sjcl/sjcl';

interface DefragmentParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  defragmentAmount: number,
  maxCoinNumber: number
};

export default async function sendNativeTokenDefragment({
  accountKeySet,
  availableNativeCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  defragmentAmount,
  maxCoinNumber
} : DefragmentParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('nativeFee', nativeFee).required().amount;
  new Validator('defragmentAmount', defragmentAmount).required().amount;

  const usePrivacyForNativeToken = true;
  const nativeFeeBN = toBNAmount(nativeFee);
  const defragmentAmountBN = toBNAmount(defragmentAmount);
  const defragmentCoins = chooseCoinToDefragment(availableNativeCoins, defragmentAmountBN, maxCoinNumber);

  // use defragment coins to pay fee
  const nativePaymentAmountBN = getValueFromCoins(defragmentCoins).sub(nativeFeeBN);

  // make sure nativePaymentAmountBN can cover the fee
  if (nativePaymentAmountBN.lte(toBNAmount(0))) {
    return;
  }

  const nativeTxInput = await getNativeTokenTxInput(
    accountKeySet,
    availableNativeCoins,
    nativePaymentAmountBN,
    nativeFeeBN,
    usePrivacyForNativeToken,
    {
      chooseCoinStrategy: () => defragmentCoins
    }
  );

  console.log('nativeTxInput', nativeTxInput);

  const nativePaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: accountKeySet.paymentAddressKeySerialized,
      amount: nativePaymentAmountBN.toNumber(),
      message: ''
    })
  ];

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initPrivacyTx,
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
    historyType: HISTORY_TYPE.DEFRAGMENT_NATIVE_TOKEN
  });
}