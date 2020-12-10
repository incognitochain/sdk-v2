import bn from 'bn.js';
import goMethods from '@src/go';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import rpc from '@src/services/rpc';
import { CM_RING_SIZE } from '@src/constants/privacy';
import { getValueFromCoins, chooseBestCoinToSpent } from '@src/services/coin';
import PaymentInfoModel from '@src/models/paymentInfo';
import CoinModel from '@src/models/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import TxHistoryModel from '@src/models/txHistory';
import { BurnAddress } from '@src/constants/wallet';
import { cacheTxHistory } from '../cache/txHistory';
import { HISTORY_TYPE, TX_STATUS } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { toNumber } from 'lodash';

export interface TxInputType {
  inputCoinStrs: CoinModel[];
  totalValueInputBN: bn;
  commitmentIndices: number[];
  myCommitmentIndices: number[];
  commitmentStrs: string[];
}

export interface CreateHistoryParam {
  txId: string;
  lockTime: number;
  nativePaymentInfoList: PaymentInfoModel[];
  privacyPaymentInfoList?: PaymentInfoModel[];
  nativeFee: string;
  privacyFee?: string;
  tokenId?: TokenIdType;
  tokenSymbol?: TokenSymbolType;
  tokenName?: TokenNameType;
  nativeSpendingCoinSNs: string[];
  privacySpendingCoinSNs?: string[];
  nativeListUTXO: string[];
  privacyListUTXO?: string[];
  nativePaymentAmount: string;
  privacyPaymentAmount?: string;
  meta?: any;
  txType?: any;
  privacyTokenTxType?: any;
  accountPublicKeySerialized: string;
  historyType: number;
  usePrivacyForPrivacyToken?: boolean;
  usePrivacyForNativeToken: boolean;
}

export interface NativeTokenTxInputOptions {
  chooseCoinStrategy: (params?: {
    availabelCoins?: CoinModel[];
    totalAmountBN?: bn;
  }) => CoinModel[];
}

/**
 * Parse number to bn (big number), min value is bn(0) (zero)
 * @param amount
 */
export function toBNAmount(amount: string) {
  new Validator('amount', amount).required().amount();
  return amount ? new bn(amount) : new bn(0);
}

/**
 *
 * @param paymentInfoList
 */
export function getTotalAmountFromPaymentList(
  paymentInfoList: PaymentInfoModel[]
): bn {
  new Validator('paymentInfoList', paymentInfoList).paymentInfoList();

  return (
    paymentInfoList?.reduce(
      (totalAmount: bn, paymentInfo: PaymentInfoModel) =>
        totalAmount.add(new bn(paymentInfo.amount)),
      new bn(0)
    ) || new bn(0)
  );
}

async function getRandomCommitments(
  paymentAddress: string,
  coinsToSpend: CoinModel[],
  usePrivacy: boolean,
  tokenId?: TokenIdType
) {
  new Validator('paymentAddress', paymentAddress).required().string();
  new Validator('coinsToSpend', coinsToSpend).required().array();
  new Validator('usePrivacy', usePrivacy).required().boolean();
  new Validator('tokenId', tokenId).string();

  let commitmentIndices: any = [];
  let myCommitmentIndices: any = [];
  let commitmentStrs: any = [];

  if (usePrivacy) {
    const randomCommitmentData = await rpc.randomCommitmentsProcess(
      paymentAddress,
      coinsToSpend,
      tokenId
    );
    commitmentIndices = randomCommitmentData.commitmentIndices;
    myCommitmentIndices = randomCommitmentData.myCommitmentIndices;
    commitmentStrs = randomCommitmentData.commitmentStrs;

    // Check number of list of random commitments, list of random commitment indices
    if (commitmentIndices.length !== coinsToSpend.length * CM_RING_SIZE) {
      throw new Error('Invalid random commitments');
    }
    if (myCommitmentIndices.length !== coinsToSpend.length) {
      throw new Error(
        'Number of list my commitment indices must be equal to number of input coins'
      );
    }
  }

  return {
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  };
}

/**
 * Prepare data for sending native token
 *
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param nativePaymentAmountBN Amount to send
 * @param nativeTokenFeeBN Fee to send (native fee)
 */
export async function getNativeTokenTxInput(
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativePaymentAmountBN: bn,
  nativeTokenFeeBN: bn,
  usePrivacy: boolean = true,
  options?: NativeTokenTxInputOptions
): Promise<TxInputType> {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins)
    .required()
    .array();
  new Validator('nativePaymentAmountBN', nativePaymentAmountBN).required();
  new Validator('nativeTokenFeeBN', nativeTokenFeeBN).required();
  new Validator('usePrivacy', usePrivacy).required().boolean();

  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const totalAmountBN = nativePaymentAmountBN.add(nativeTokenFeeBN);
  const bestCoins = options?.chooseCoinStrategy
    ? {
        resultInputCoins: options?.chooseCoinStrategy({
          availabelCoins: availableNativeCoins,
          totalAmountBN,
        }),
      }
    : chooseBestCoinToSpent(availableNativeCoins, totalAmountBN);
  const coinsToSpend: CoinModel[] = bestCoins.resultInputCoins;
  const totalValueToSpendBN = getValueFromCoins(coinsToSpend);
  if (totalAmountBN.cmp(totalValueToSpendBN) === 1) {
    throw new Error('Not enough coin');
  }
  const {
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  } = await getRandomCommitments(paymentAddress, coinsToSpend, usePrivacy);
  for (let i = 0; i < coinsToSpend.length; i++) {
    // set info for input coin is null
    coinsToSpend[i].info = '';
  }
  const result = {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpendBN,
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  };
  return result;
}

/***
 * Prepare data for send privacy token
 *
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param privacyPaymentAmountBN Amount to send
 * @param privacyTokenFeeBN Fee to send (privacy token fee)
 */
export async function getPrivacyTokenTxInput(
  accountKeySet: AccountKeySetModel,
  privacyAvailableCoins: CoinModel[],
  tokenId: TokenIdType,
  privacyPaymentAmountBN: bn,
  privacyTokenFeeBN: bn,
  usePrivacy: boolean = true
): Promise<TxInputType> {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('privacyAvailableCoins', privacyAvailableCoins)
    .required()
    .array();
  new Validator('tokenId', tokenId).required().string();
  new Validator('privacyPaymentAmountBN', privacyPaymentAmountBN).required();
  new Validator('privacyTokenFeeBN', privacyTokenFeeBN).required();
  new Validator('usePrivacy', usePrivacy).required().boolean();

  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  let coinsToSpend: CoinModel[] = [];
  let totalValueToSpentBN = new bn(0);
  let commitmentIndices = [];
  let myCommitmentIndices = [];
  let commitmentStrs = [];

  if (tokenId) {
    const totalAmountBN = privacyPaymentAmountBN.add(privacyTokenFeeBN);
    const bestCoins = chooseBestCoinToSpent(
      privacyAvailableCoins,
      totalAmountBN
    );

    coinsToSpend = bestCoins.resultInputCoins;
    totalValueToSpentBN = getValueFromCoins(coinsToSpend);

    if (totalAmountBN.cmp(totalValueToSpentBN) === 1) {
      throw new ErrorCode('Not enough coin');
    }

    const RandomCommitmentData = await getRandomCommitments(
      paymentAddress,
      coinsToSpend,
      usePrivacy,
      tokenId
    );
    commitmentIndices = RandomCommitmentData.commitmentIndices;
    myCommitmentIndices = RandomCommitmentData.myCommitmentIndices;
    commitmentStrs = RandomCommitmentData.commitmentStrs;

    for (let i = 0; i < coinsToSpend.length; i++) {
      // set info for input coin is null
      coinsToSpend[i].info = '';
    }
  }
  const result = {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpentBN,
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  };
  return result;
}

export async function initTx(handler: Function, param: object) {
  new Validator('handler', handler).required().function();
  new Validator('param', param).required();

  const jsonStringParam = JSON.stringify(param);

  const response = await handler(jsonStringParam);
  if (!response) {
    throw new ErrorCode('Can not init transaction');
  }

  return response;
}

/**
 * Create output coins
 *
 * @param totalAmountToTransferBN Amount will be transfered
 * @param totalAmountToSpendBN Amount uses to send
 * @param paymentInfoList
 */
export async function createOutputCoin(
  totalAmountToTransferBN: bn,
  totalAmountToSpendBN: bn,
  paymentInfoList: PaymentInfoModel[]
) {
  new Validator('totalAmountToTransferBN', totalAmountToTransferBN).required();
  new Validator('totalAmountToSpendBN', totalAmountToSpendBN).required();
  new Validator('paymentInfoList', paymentInfoList).paymentInfoList();
  if (totalAmountToSpendBN.lt(totalAmountToTransferBN)) {
    throw new Error(
      'Amount uses to spend must larger than or equal amount uses to transfer'
    );
  }
  let numberOutput = paymentInfoList?.length || 0;
  if (totalAmountToSpendBN.gt(totalAmountToTransferBN)) {
    numberOutput++;
  }

  const sndOutputs: string[] = new Array(numberOutput);

  if (numberOutput > 0) {
    const sndOutputStrs = await goMethods.randomScalars(
      numberOutput.toString()
    );
    if (sndOutputStrs === null || sndOutputStrs === '') {
      throw new Error('Can not random scalars for output coins');
    }

    let sndDecodes = base64Decode(sndOutputStrs);

    for (let i = 0; i < numberOutput; i++) {
      let sndBytes = sndDecodes.slice(
        i * ED25519_KEY_SIZE,
        (i + 1) * ED25519_KEY_SIZE
      );
      sndOutputs[i] = checkEncode(sndBytes, ENCODE_VERSION);
    }
  }
  return sndOutputs;
}

export function encryptPaymentMessage(paymentInfoList: PaymentInfoModel[]) {
  new Validator('paymentInfoList', paymentInfoList).paymentInfoList();

  // TODO
  return paymentInfoList;
}

export async function sendB58CheckEncodeTxToChain(
  handler: Function,
  b58CheckEncodeTx: string
) {
  new Validator('handler', handler).required().function();
  new Validator('b58CheckEncodeTx', b58CheckEncodeTx).required().string();

  const response: { txId: string } = await handler(b58CheckEncodeTx);

  if (response?.txId) {
    return response;
  }

  throw new ErrorCode('Send tx failed');
}

export function getCoinInfoForCache(coins: CoinModel[]) {
  new Validator('coins', coins).required().array();

  const serialNumberList: string[] = [];
  const listUTXO: string[] = [];

  coins.forEach((coin) => {
    serialNumberList.push(coin.serialNumber);
    listUTXO.push(coin.snDerivator);
  });

  return {
    serialNumberList,
    listUTXO,
  };
}

export function createHistoryInfo({
  txId,
  lockTime,
  nativePaymentInfoList,
  privacyPaymentInfoList,
  nativePaymentAmount,
  privacyPaymentAmount,
  nativeFee,
  privacyFee,
  tokenId,
  tokenSymbol,
  tokenName,
  nativeSpendingCoinSNs,
  privacySpendingCoinSNs,
  nativeListUTXO,
  privacyListUTXO,
  meta,
  txType,
  privacyTokenTxType,
  accountPublicKeySerialized,
  historyType,
  usePrivacyForPrivacyToken,
  usePrivacyForNativeToken,
}: CreateHistoryParam) {
  const history = new TxHistoryModel({
    txId,
    txType,
    lockTime,
    status: TX_STATUS.SUCCESS,
    nativeTokenInfo: {
      spendingCoinSNs: nativeSpendingCoinSNs,
      listUTXO: nativeListUTXO,
      fee: nativeFee,
      amount: nativePaymentAmount,
      paymentInfoList: nativePaymentInfoList,
      usePrivacy: usePrivacyForNativeToken,
    },
    privacyTokenInfo: {
      spendingCoinSNs: privacySpendingCoinSNs,
      listUTXO: privacyListUTXO,
      tokenName,
      tokenSymbol,
      tokenId,
      fee: privacyFee,
      amount: privacyPaymentAmount,
      paymentInfoList: privacyPaymentInfoList,
      usePrivacy: usePrivacyForPrivacyToken,
      privacyTokenTxType,
    },
    meta,
    accountPublicKeySerialized,
    historyType,
  });
  cacheTxHistory(history.txId, history);
  return history;
}

export async function getBurningAddress(beaconHeight = 0) {
  let burningAddress;
  try {
    burningAddress = await rpc.getBurningAddress(beaconHeight);
  } catch (e) {
    burningAddress = BurnAddress;
  }

  return burningAddress;
}
