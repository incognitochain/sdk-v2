import bn from 'bn.js';
import { getTotalAmountFromPaymentList, createOutputCoin, TxInputType, initTx, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache } from './utils';
import rpc from '@src/services/rpc';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION } from '@src/constants/constants';
import wasmMethods from '@src/wasm/methods';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';


interface SendParam {
  accountKeySet: AccountKeySetModel,
  avaiableCoins: CoinModel[],
  nativePaymentInfoList: PaymentInfoModel[],
  privacyPaymentInfoList: PaymentInfoModel[],
  nativeFee: number,
  privacyFee: number,
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
    inputCoinStrs: nativeTxInput.inputCoinStrs,
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

// function createHistoryInfo(txInfo) {
//   return {
//     ...txInfo,
//     typeTx: TxNormalType,
//     feeNativeToken: nativeTokenFeeBN.toNumber(),
//     lockTime: txInfo.lockTime,
//     amountNativeToken: nativePaymentAmountBN.toNumber(),
//     txStatus: SuccessTx
//   };
// }

export async function sendNativeToken({ nativePaymentInfoList, nativeFee, accountKeySet, avaiableCoins } : SendParam) {
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTokenFeeBN = toBNAmount(nativeFee);

  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, avaiableCoins, nativePaymentAmountBN, nativeTokenFeeBN);
  console.log('txInput', nativeTxInput);

  const txInfo = await createTx({ nativeTxInput, nativePaymentAmountBN, nativeTokenFeeBN, privateKeySerialized: accountKeySet.privateKeySerialized, nativePaymentInfoList });
  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);

  // const historyInfo = createHistoryInfo({ ...sentInfo, lockTime: txInfo.lockTime });

  const { serialNumberList, listUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  return {
    sentInfo,
    serialNumberList,
    listUTXO
  };
}