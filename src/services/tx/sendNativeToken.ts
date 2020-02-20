import bn from 'bn.js';
import { getTotalAmountFromPaymentList, createOutputCoin, TxInputType, initTx, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo } from './utils';
import rpc from '@src/services/rpc';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION } from '@src/constants/constants';
import wasmMethods from '@src/wasm/methods';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import { TxNormalType } from '@src/tx/constants';

interface SendParam {
  accountKeySet: AccountKeySetModel,
  availableCoins: CoinModel[],
  nativePaymentInfoList: PaymentInfoModel[],
  nativeFee: number,
};

interface CreateTxParam {
  nativeTxInput: TxInputType,
  nativePaymentInfoList: PaymentInfoModel[],
  nativeTokenFeeBN: bn,
  nativePaymentAmountBN: bn,
  privateKeySerialized: string,
};

async function createTx({ nativeTokenFeeBN, nativePaymentAmountBN, nativeTxInput, nativePaymentInfoList, privateKeySerialized } : CreateTxParam) {
  const outputCoins = createOutputCoin(nativePaymentAmountBN.add(nativeTokenFeeBN), nativeTxInput.totalValueInputBN, nativePaymentInfoList);

  console.log('outputCoint', outputCoins);

  const paramInitTx = {
    senderSK: privateKeySerialized,
    paramPaymentInfos: nativePaymentInfoList,
    inputCoinStrs: nativeTxInput.inputCoinStrs.map(coin => coin.toJson()),
    fee: nativeTokenFeeBN.toNumber(),
    isPrivacy: true,
    tokenID: <string>null,
    metaData: <any>null,
    info: '',
    commitmentIndices: nativeTxInput.commitmentIndices,
    myCommitmentIndices: nativeTxInput.myCommitmentIndices,
    commitmentStrs: nativeTxInput.commitmentStrs,
    sndOutputs: outputCoins
  };

  console.log('paramInitTx', paramInitTx);
  
  const resInitTx = await initTx(wasmMethods.initPrivacyTx, paramInitTx);

  console.log('resInitTx', resInitTx);

  //base64 decode txjson
  let resInitTxBytes = base64Decode(resInitTx);

  // get b58 check encode tx json
  let b58CheckEncodeTx = checkEncode(resInitTxBytes.slice(0, resInitTxBytes.length - 8), ENCODE_VERSION);

  // get lock time tx
  let lockTimeBytes = resInitTxBytes.slice(resInitTxBytes.length - 8);
  let lockTime = new bn(lockTimeBytes).toNumber();

  return {
    b58CheckEncodeTx,
    lockTime
  };
}

export default async function sendNativeToken({ nativePaymentInfoList, nativeFee, accountKeySet, availableCoins } : SendParam) {
  const usePrivacyForNativeToken = true;
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTokenFeeBN = toBNAmount(nativeFee);

  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);
  console.log('txInput', nativeTxInput);

  const txInfo = await createTx({ nativeTxInput, nativePaymentAmountBN, nativeTokenFeeBN, privateKeySerialized: accountKeySet.privateKeySerialized, nativePaymentInfoList });
  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);

  // const historyInfo = createHistoryInfo({ ...sentInfo, lockTime: txInfo.lockTime });

  const { serialNumberList, listUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);

  const history = createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO: listUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs: serialNumberList,
    txType: TxNormalType,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
  });

  return history;
}