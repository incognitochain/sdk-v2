import bn from 'bn.js';
import {
  getTotalAmountFromPaymentList,
  createOutputCoin,
  TxInputType,
  initTx,
  getNativeTokenTxInput,
  toBNAmount,
  sendB58CheckEncodeTxToChain,
  getCoinInfoForCache,
  getPrivacyTokenTxInput,
  createHistoryInfo,
} from './utils';
import rpc from '@src/services/rpc';
import { base64Decode, base64Encode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION, DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import goMethods from '@src/go';
import { convertHashToStr } from '@src/utils/common';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel, { CoinRawData } from '@src/models/coin';
import {
  PRIVACY_TOKEN_TX_TYPE,
  TX_TYPE,
  HISTORY_TYPE,
} from '@src/constants/tx';
import Validator from '@src/utils/validator';
import BN from 'bn.js';

interface TokenInfo {
  tokenId: TokenIdType;
  tokenSymbol: TokenSymbolType;
  tokenName: TokenNameType;
}

interface SendParam extends TokenInfo {
  accountKeySet: AccountKeySetModel;
  nativeAvailableCoins: CoinModel[];
  privacyAvailableCoins: CoinModel[];
  nativePaymentInfoList?: PaymentInfoModel[];
  privacyPaymentInfoList: PaymentInfoModel[];
  nativeFee: string;
  privacyFee: string;
}

interface CreateTxParam extends TokenInfo {
  nativeTxInput: TxInputType;
  nativePaymentInfoList?: PaymentInfoModel[];
  nativeTokenFeeBN: bn;
  privacyTxInput: TxInputType;
  privacyPaymentInfoList: PaymentInfoModel[];
  privacyTokenFeeBN: bn;
  privateKeySerialized: string;
  nativePaymentAmountBN: bn;
  privacyPaymentAmountBN: bn;
  privacyTokenParamAdditional?: PrivacyTokenParam;
  usePrivacyForNativeToken?: boolean;
  usePrivacyForPrivacyToken?: boolean;
  metaData?: any;
  initTxMethod: Function;
  customExtractInfoFromInitedTxMethod?(
    resInitTxBytes: Uint8Array
  ): { b58CheckEncodeTx: string; lockTime: number; tokenID?: TokenIdType };
}

interface PrivacyTokenParam {
  propertyID?: TokenIdType;
  propertyName?: TokenNameType;
  propertySymbol?: TokenSymbolType;
  amount?: string;
  tokenTxType?: TokenTxType;
  fee?: string;
  paymentInfoForPToken?: PaymentInfoModel[];
  tokenInputs?: CoinRawData[];
}

export function extractInfoFromInitedTxBytes(resInitTxBytes: Uint8Array) {
  new Validator('resInitTxBytes', resInitTxBytes).required();

  // get b58 check encode tx json
  let b58CheckEncodeTx = checkEncode(
    resInitTxBytes.slice(0, resInitTxBytes.length - 40),
    ENCODE_VERSION
  );

  // get lock time tx
  let lockTimeBytes = resInitTxBytes.slice(
    resInitTxBytes.length - 40,
    resInitTxBytes.length - 32
  );
  let lockTime = new bn(lockTimeBytes).toNumber();
  let tokenIDBytes = resInitTxBytes.slice(resInitTxBytes.length - 32);
  let tokenID = convertHashToStr(tokenIDBytes).toLowerCase();

  return {
    b58CheckEncodeTx,
    lockTime,
    tokenID,
  };
}

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
  usePrivacyForNativeToken = true,
  usePrivacyForPrivacyToken = true,
  metaData,
  initTxMethod,
  customExtractInfoFromInitedTxMethod,
}: CreateTxParam) {
  new Validator('nativeTxInput', nativeTxInput).required();
  new Validator(
    'nativePaymentInfoList',
    nativePaymentInfoList
  ).paymentInfoList();
  new Validator('nativeTokenFeeBN', nativeTokenFeeBN).required();
  new Validator('nativePaymentAmountBN', nativePaymentAmountBN).required();
  new Validator('privacyTxInput', privacyTxInput).required();
  new Validator('privacyPaymentInfoList', privacyPaymentInfoList)
    .required()
    .paymentInfoList();
  new Validator('privacyTokenFeeBN', privacyTokenFeeBN).required();
  new Validator('privateKeySerialized', privateKeySerialized)
    .required()
    .string();
  new Validator('tokenId', tokenId).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('tokenSymbol', tokenSymbol).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('usePrivacyForNativeToken', usePrivacyForNativeToken)
    .required()
    .boolean();
  new Validator('usePrivacyForPrivacyToken', usePrivacyForPrivacyToken)
    .required()
    .boolean();
  new Validator('initTxMethod', initTxMethod).required();

  const nativeOutputCoins = await createOutputCoin(
    nativePaymentAmountBN.add(nativeTokenFeeBN),
    nativeTxInput.totalValueInputBN,
    nativePaymentInfoList
  );
  const privacyOutputCoins = await createOutputCoin(
    privacyPaymentAmountBN.add(privacyTokenFeeBN),
    privacyTxInput.totalValueInputBN,
    privacyPaymentInfoList
  );

  nativePaymentInfoList.forEach((item) => {
    item.amount = new BN(item.amount).toString();
    item.message = base64Encode(item.message);
  });

  privacyPaymentInfoList.forEach((item) => {
    item.amount = new BN(item.amount).toString();
    item.message = base64Encode(item.message);
  });

  const privacyTokenParam: PrivacyTokenParam = {
    propertyID: tokenId,
    propertyName: tokenName,
    propertySymbol: tokenSymbol,
    amount: '0',
    tokenTxType: PRIVACY_TOKEN_TX_TYPE.TRANSFER,
    fee: privacyTokenFeeBN.toString(),
    paymentInfoForPToken: privacyPaymentInfoList,
    tokenInputs: privacyTxInput.inputCoinStrs.map((coin) => coin.toJson()),
    ...privacyTokenParamAdditional,
  };

  const paramInitTx = {
    privacyTokenParam,
    senderSK: privateKeySerialized,
    paramPaymentInfos: nativePaymentInfoList || [],
    inputCoinStrs: nativeTxInput.inputCoinStrs.map((coin) => coin.toJson()),
    fee: nativeTokenFeeBN.toString(),
    isPrivacy: usePrivacyForNativeToken,
    isPrivacyForPToken: usePrivacyForPrivacyToken,
    metaData,
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

  const resInitTx = await initTx(initTxMethod, paramInitTx);

  //base64 decode txjson
  let resInitTxBytes = base64Decode(resInitTx);

  return (customExtractInfoFromInitedTxMethod
    ? customExtractInfoFromInitedTxMethod
    : extractInfoFromInitedTxBytes)(resInitTxBytes);
}

export function hasExchangeRate(tokenId: string) {
  return rpc.isExchangeRatePToken(tokenId).catch(() => false);
}

export default async function sendPrivacyToken({
  accountKeySet,
  nativeAvailableCoins,
  privacyAvailableCoins,
  nativePaymentInfoList,
  privacyPaymentInfoList,
  nativeFee = DEFAULT_NATIVE_FEE,
  privacyFee,
  tokenId,
  tokenSymbol,
  tokenName,
}: SendParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('nativeAvailableCoins', nativeAvailableCoins).required();
  new Validator('privacyAvailableCoins', privacyAvailableCoins).required();
  new Validator(
    'nativePaymentInfoList',
    nativePaymentInfoList
  ).paymentInfoList();
  new Validator('privacyPaymentInfoList', privacyPaymentInfoList)
    .required()
    .paymentInfoList();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('privacyFee', privacyFee).required().amount();
  new Validator('tokenId', tokenId).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('tokenSymbol', tokenSymbol).required().string();

  if (privacyFee && !(await hasExchangeRate(tokenId))) {
    throw new ErrorCode(
      `Token ${tokenId} can not use for paying fee, has no exchange rate!`
    );
  }

  const usePrivacyForPrivacyToken = true;
  const usePrivacyForNativeToken = true;
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(
    nativePaymentInfoList
  );
  const privacyTokenFeeBN = toBNAmount(privacyFee);
  const privacyPaymentAmountBN = getTotalAmountFromPaymentList(
    privacyPaymentInfoList
  );
  const nativeTxInput = await getNativeTokenTxInput(
    accountKeySet,
    nativeAvailableCoins,
    nativePaymentAmountBN,
    nativeTokenFeeBN,
    usePrivacyForNativeToken
  );
  const privacyTxInput = await getPrivacyTokenTxInput(
    accountKeySet,
    privacyAvailableCoins,
    tokenId,
    privacyPaymentAmountBN,
    privacyTokenFeeBN,
    usePrivacyForPrivacyToken
  );
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
    initTxMethod: goMethods.initPrivacyTokenTx,
  });

  const sentInfo = await sendB58CheckEncodeTxToChain(
    rpc.sendRawTxCustomTokenPrivacy,
    txInfo.b58CheckEncodeTx
  );

  const {
    serialNumberList: nativeSpendingCoinSNs,
    listUTXO: nativeListUTXO,
  } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  const {
    serialNumberList: privacySpendingCoinSNs,
    listUTXO: privacyListUTXO,
  } = getCoinInfoForCache(privacyTxInput.inputCoinStrs);

  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toString(),
    nativeSpendingCoinSNs,
    tokenSymbol,
    tokenName,
    tokenId,
    privacyFee,
    privacyListUTXO,
    privacyPaymentAmount: privacyPaymentAmountBN.toString(),
    privacyPaymentInfoList,
    privacySpendingCoinSNs,
    txType: TX_TYPE.PRIVACY_TOKEN_WITH_PRIVACY_MODE,
    privacyTokenTxType: PRIVACY_TOKEN_TX_TYPE.TRANSFER,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    historyType: HISTORY_TYPE.SEND_PRIVACY_TOKEN,
  });
}
