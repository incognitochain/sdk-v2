import bn from 'bn.js';
import { getTotalAmountFromPaymentList, createOutputCoin, TxInputType, initTx, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput } from './utils';
import rpc from '@src/services/rpc';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION } from '@src/constants/constants';
import wasmMethods from '@src/wasm/methods';
import { convertHashToStr } from '@src/utils/common';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import { CustomTokenTransfer } from '@src/tx/constants';

interface TokenInfo {
  tokenId: TokenIdType,
  tokenSymbol: TokenSymbolType,
  tokenName: TokenNameType,
};

interface SendParam extends TokenInfo {
  accountKeySet: AccountKeySetModel,
  avaiableCoins: CoinModel[],
  nativePaymentInfoList: PaymentInfoModel[],
  privacyPaymentInfoList: PaymentInfoModel[],
  nativeFee: number,
  privacyFee: number,
};

interface CreateTxParam  extends TokenInfo {
  nativeTxInput: TxInputType,
  nativePaymentInfoList: PaymentInfoModel[],
  nativeTokenFeeBN: bn,
  privacyTxInput: TxInputType,
  privacyPaymentInfoList: PaymentInfoModel[],
  privacyTokenFeeBN: bn,
  privateKeySerialized: string,
  nativePaymentAmountBN: bn,
  privacyPaymentAmountBN: bn,
  privacyTokenParamAdditional?: object
};

export async function createTx({
  nativeTxInput,
  nativePaymentInfoList,
  nativeTokenFeeBN,
  nativePaymentAmountBN,
  privacyTxInput,
  privacyPaymentInfoList,
  privacyTokenFeeBN,
  privacyPaymentAmountBN,
  privateKeySerialized,
  tokenId,
  tokenName,
  tokenSymbol,
  privacyTokenParamAdditional,
} : CreateTxParam) {
  const nativeOutputCoins = createOutputCoin(nativePaymentAmountBN.add(nativeTokenFeeBN), nativeTxInput.totalValueInputBN, nativePaymentInfoList);
  const privacyOutputCoins = createOutputCoin(privacyPaymentAmountBN.add(privacyTokenFeeBN), privacyTxInput.totalValueInputBN, privacyPaymentInfoList);

  console.log('nativeOutputCoins', nativeOutputCoins);
  console.log('privacyOutputCoins', privacyOutputCoins);

  const privacyTokenParam = {
    propertyID: tokenId,
    propertyName: tokenName,
    propertySymbol: tokenSymbol,
    amount: 0,
    tokenTxType: CustomTokenTransfer,
    fee: privacyTokenFeeBN.toNumber(),
    paymentInfoForPToken: privacyPaymentInfoList,
    ...privacyTokenParamAdditional
  };

  const paramInitTx = {
    privacyTokenParam,
    senderSK: privateKeySerialized,
    paramPaymentInfos: nativePaymentInfoList,
    inputCoinStrs: nativeTxInput.inputCoinStrs,
    fee: nativeTokenFeeBN.toNumber(),
    isPrivacy: true,
    isPrivacyForPToken: true,
    metaData: <any>null,
    info: '',
    commitmentIndicesForNativeToken: nativeTxInput.commitmentIndices,
    myCommitmentIndicesForNativeToken: nativeTxInput.myCommitmentIndices,
    commitmentStrsForNativeToken: nativeTxInput.commitmentStrs,
    sndOutputsForNativeToken: nativeOutputCoins,
    commitmentIndicesForPToken: privacyTxInput.commitmentIndices,
    myCommitmentIndicesForPToken: privacyTxInput.myCommitmentIndices,
    commitmentStrsForPToken: privacyTxInput.commitmentStrs,
    sndOutputsForPToken: privacyOutputCoins,
  };

  console.log('paramInitTx: ', paramInitTx);

  const resInitTx = await initTx(wasmMethods.initPrivacyTokenTx, paramInitTx);
  console.log('createAndSendNativeToken resInitTx: ', resInitTx);

  //base64 decode txjson
  let resInitTxBytes = base64Decode(resInitTx);

  // get b58 check encode tx json
  let b58CheckEncodeTx = checkEncode(resInitTxBytes.slice(0, resInitTxBytes.length - 40), ENCODE_VERSION);

  // get lock time tx
  let lockTimeBytes = resInitTxBytes.slice(resInitTxBytes.length - 40, resInitTxBytes.length - 32);
  let lockTime = new bn(lockTimeBytes).toNumber();
  let tokenIDBytes = resInitTxBytes.slice(resInitTxBytes.length - 32);
  let tokenID = convertHashToStr(tokenIDBytes).toLowerCase();

  return {
    b58CheckEncodeTx,
    lockTime,
    tokenID
  };
}

// createHistoryInfo(txInfo) {
//   return {
//     ...txInfo,
//     typeTx: TxCustomTokenPrivacyType,
//     feeNativeToken: nativeTokenFeeBN.toNumber(),
//     feePrivacyToken: privacyTokenFeeBN.toNumber(),
//     lockTime: txInfo.lockTime,
//     amountNativeToken: nativePaymentAmountBN.toNumber(),
//     amountPrivacyToken: privacyPaymentAmountBN.toNumber(),
//     txStatus: SuccessTx,
//     tokenTxType: CustomTokenTransfer
//   };
// }

export async function sendPrivacyToken({
  accountKeySet,
  avaiableCoins,
  nativePaymentInfoList,
  privacyPaymentInfoList,
  nativeFee,
  privacyFee,
  tokenId,
  tokenSymbol,
  tokenName
} : SendParam) {
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(privacyFee);
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
    tokenName
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