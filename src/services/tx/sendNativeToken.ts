import bn from 'bn.js';
import { getTotalAmountFromPaymentList, createOutputCoin, TxInputType, initTx, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, createHistoryInfo } from './utils';
import rpc from '@src/services/rpc';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION } from '@src/constants/constants';
import goMethods from '@src/go';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import { TX_TYPE } from '@src/constants/tx';
import Validator from '@src/utils/validator';

interface SendParam {
  accountKeySet: AccountKeySetModel,
  availableCoins: CoinModel[],
  nativePaymentInfoList: PaymentInfoModel[],
  nativeFee: number,
};

interface CreateNativeTxParam {
  nativeTxInput: TxInputType,
  nativePaymentInfoList: PaymentInfoModel[],
  nativeTokenFeeBN: bn,
  nativePaymentAmountBN: bn,
  privateKeySerialized: string,
  usePrivacyForNativeToken?: boolean,
  metaData?: any,
  initTxMethod: Function,
  customExtractInfoFromInitedTxMethod?(resInitTxBytes:Uint8Array): ({ b58CheckEncodeTx: string, lockTime: number })
};

export function extractInfoFromInitedTxBytes(resInitTxBytes: Uint8Array) {
  new Validator('resInitTxBytes', resInitTxBytes).required();

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

export async function createTx({
  nativeTokenFeeBN,
  nativePaymentAmountBN,
  nativeTxInput,
  nativePaymentInfoList,
  privateKeySerialized,
  usePrivacyForNativeToken = true,
  metaData,
  initTxMethod,
  customExtractInfoFromInitedTxMethod
} : CreateNativeTxParam) {
  new Validator('nativeTokenFeeBN', nativeTokenFeeBN).required();
  new Validator('nativePaymentAmountBN', nativePaymentAmountBN).required();
  new Validator('nativeTxInput', nativeTxInput).required();
  new Validator('nativePaymentInfoList', nativePaymentInfoList).required();
  new Validator('privateKeySerialized', privateKeySerialized).required().string();
  new Validator('usePrivacyForNativeToken', usePrivacyForNativeToken).required().boolean();
  new Validator('initTxMethod', initTxMethod).required();

  const outputCoins = await createOutputCoin(nativePaymentAmountBN.add(nativeTokenFeeBN), nativeTxInput.totalValueInputBN, nativePaymentInfoList);

  console.log('outputCoint', outputCoins);

  const paramInitTx = {
    senderSK: privateKeySerialized,
    paramPaymentInfos: nativePaymentInfoList,
    inputCoinStrs: nativeTxInput.inputCoinStrs.map(coin => coin.toJson()),
    fee: nativeTokenFeeBN.toNumber(),
    isPrivacy: usePrivacyForNativeToken,
    tokenID: <string>null,
    metaData,
    info: '',
    commitmentIndices: nativeTxInput.commitmentIndices,
    myCommitmentIndices: nativeTxInput.myCommitmentIndices,
    commitmentStrs: nativeTxInput.commitmentStrs,
    sndOutputs: outputCoins
  };

  console.log('paramInitTx', paramInitTx);
  
  const resInitTx = await initTx(initTxMethod, paramInitTx);

  console.log('resInitTx', resInitTx);

  //base64 decode txjson
  const resInitTxBytes = base64Decode(resInitTx);

  return (customExtractInfoFromInitedTxMethod ? customExtractInfoFromInitedTxMethod : extractInfoFromInitedTxBytes)(resInitTxBytes);
}

export default async function sendNativeToken({ nativePaymentInfoList, nativeFee, accountKeySet, availableCoins } : SendParam) {
  const usePrivacyForNativeToken = true;
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTokenFeeBN = toBNAmount(nativeFee);

  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);
  console.log('txInput', nativeTxInput);

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentAmountBN,
    nativeTokenFeeBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    nativePaymentInfoList,
    initTxMethod: goMethods.initPrivacyTx,
    usePrivacyForNativeToken,
  });
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
    txType: TX_TYPE.NORMAL,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
  });

  return history;
}