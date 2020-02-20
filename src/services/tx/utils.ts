import bn from 'bn.js';
import wasmMethods from '@src/wasm/methods';
import { base64Decode } from '@src/privacy/utils';
import { checkEncode } from '@src/utils/base58';
import { ENCODE_VERSION, ED25519_KEY_SIZE } from '@src/constants/constants';
import rpc from '@src/services/rpc';
import { CM_RING_SIZE } from '@src/privacy/constants';
import { getValueFromCoins, chooseBestCoinToSpent } from '@src/services/coin';
import PaymentInfoModel from '@src/models/paymentInfo';
import CoinModel from '@src/models/coin';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import { TxHistoryModel } from '@src/models/txHistory';
import { SuccessTx } from '@src/services/wallet/constants';
import { cacheTxHistory } from '../cache/txHistory';

export interface TxInputType {
  inputCoinStrs: CoinModel[],
  totalValueInputBN: bn,
  commitmentIndices: number[],
  myCommitmentIndices: number[],
  commitmentStrs: string[],
};

export interface CreateHistoryParam {
  txId: string,
  lockTime: number,
  nativePaymentInfoList: PaymentInfoModel[],
  privacyPaymentInfoList?: PaymentInfoModel[],
  nativeFee: number,
  privacyFee?: number,
  tokenId?: TokenIdType,
  tokenSymbol?: TokenSymbolType,
  tokenName?: TokenNameType,
  nativeSpendingCoinSNs: string[],
  privacySpendingCoinSNs?: string[],
  nativeListUTXO: string[],
  privacyListUTXO?: string[],
  nativePaymentAmount: number,
  privacyPaymentAmount?: number,
  meta?: any,
  txType?: any,
  privacyTokenTxType?: any,
  accountPublicKeySerialized: string,
  devInfo?: any,
  usePrivacyForPrivacyToken?: boolean,
  usePrivacyForNativeToken: boolean
};

/**
 * Parse number to bn (big number), min value is bn(0) (zero)
 * @param amount 
 */
export function toBNAmount(amount: number) {
  return new bn(Math.max(amount, 0)) || new bn(0);
}

/**
 * 
 * @param paymentInfoList 
 */
export function getTotalAmountFromPaymentList(paymentInfoList: PaymentInfoModel[]) : bn {
  return paymentInfoList.reduce((totalAmount: bn, paymentInfo: PaymentInfoModel) => totalAmount.add(new bn(paymentInfo.amount)), new bn(0));
}

async function getRandomCommitments(paymentAddress: string, coinsToSpend: CoinModel[], usePrivacy: boolean, tokenId?: TokenIdType) {
  let commitmentIndices = [];
  let myCommitmentIndices = [];
  let commitmentStrs = [];

  if (usePrivacy) {
    const randomCommitmentData = await rpc.randomCommitmentsProcess(paymentAddress, coinsToSpend, tokenId);

    commitmentIndices = randomCommitmentData.commitmentIndices;
    myCommitmentIndices = randomCommitmentData.myCommitmentIndices;
    commitmentStrs = randomCommitmentData.commitmentStrs;

    // Check number of list of random commitments, list of random commitment indices
    if (commitmentIndices.length !== coinsToSpend.length * CM_RING_SIZE) {
      throw new Error('Invalid random commitments');
    }
    if (myCommitmentIndices.length !== coinsToSpend.length) {
      throw new Error('Number of list my commitment indices must be equal to number of input coins');
    }
  }

  return {
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs
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
export async function getNativeTokenTxInput(accountKeySet: AccountKeySetModel, availableNativeCoins: CoinModel[], nativePaymentAmountBN: bn, nativeTokenFeeBN: bn, usePrivacy: boolean = true) : Promise<TxInputType> {
  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const totalAmountBN = nativePaymentAmountBN.add(nativeTokenFeeBN);
  const bestCoins = chooseBestCoinToSpent(availableNativeCoins, totalAmountBN);
  const coinsToSpend: CoinModel[] = bestCoins.resultInputCoins;
  const totalValueToSpendBN = getValueFromCoins(coinsToSpend);
  
  if (totalAmountBN.cmp(totalValueToSpendBN) === 1) {
    throw new Error('Not enough coin');
  }

  const { commitmentIndices, myCommitmentIndices, commitmentStrs } = await getRandomCommitments(paymentAddress, coinsToSpend, usePrivacy);

  for (let i = 0; i < coinsToSpend.length; i++) {
    // set info for input coin is null
    coinsToSpend[i].info = '';
  }

  return {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpendBN,
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  };
}


/***
 * Prepare data for send privacy token
 * 
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param privacyPaymentAmountBN Amount to send
 * @param privacyTokenFeeBN Fee to send (privacy token fee)
 */
export async function getPrivacyTokenTxInput(accountKeySet: AccountKeySetModel, privacyAvailableCoins: CoinModel[], tokenId: TokenIdType, privacyPaymentAmountBN: bn, privacyTokenFeeBN: bn, usePrivacy: boolean = true) : Promise<TxInputType> {
  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  let coinsToSpend: CoinModel[] = [];
  let totalValueToSpentBN = new bn(0);
  let commitmentIndices = [];
  let myCommitmentIndices = [];
  let commitmentStrs = [];

  if (tokenId) {
    const totalAmountBN = privacyPaymentAmountBN.add(privacyTokenFeeBN);
    const bestCoins = chooseBestCoinToSpent(privacyAvailableCoins, totalAmountBN);

    coinsToSpend = bestCoins.resultInputCoins;
    totalValueToSpentBN = getValueFromCoins(coinsToSpend);

    if (totalAmountBN.cmp(totalValueToSpentBN) === 1) {
      throw new Error('Not enough coin');
    }

    const RandomCommitmentData = await getRandomCommitments(paymentAddress, coinsToSpend, usePrivacy, tokenId);
    commitmentIndices = RandomCommitmentData.commitmentIndices;
    myCommitmentIndices = RandomCommitmentData.myCommitmentIndices;
    commitmentStrs = RandomCommitmentData.commitmentStrs;

    for (let i = 0; i < coinsToSpend.length; i++) {
      // set info for input coin is null
      coinsToSpend[i].info = '';
    }
  }
  
  return {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpentBN,
    commitmentIndices,
    myCommitmentIndices,
    commitmentStrs,
  };
}

export async function initTx(handler: Function, param: object) {
  const response = await handler(JSON.stringify(param));
  if (!response) {
    throw new Error('Can not init transaction');
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
export function createOutputCoin(totalAmountToTransferBN: bn, totalAmountToSpendBN: bn, paymentInfoList: PaymentInfoModel[]): string[] {
  if (totalAmountToSpendBN.lt(totalAmountToTransferBN)) {
    throw new Error('Amount uses to spend must larger than or equal amount uses to transfer');
  }

  let numberOutput = paymentInfoList.length;
  if (totalAmountToSpendBN.gt(totalAmountToTransferBN)) {
    numberOutput++;
  }

  const sndOutputs: string[] = new Array(numberOutput);

  if (numberOutput > 0) {
    const sndOutputStrs = wasmMethods.randomScalars(numberOutput);
    if (sndOutputStrs === null || sndOutputStrs === '') {
      throw new Error('Can not random scalars for output coins');
    }
  
    console.log('sndOutputStrs: ', sndOutputStrs);
  
    let sndDecodes = base64Decode(sndOutputStrs);
  
    for (let i = 0; i < numberOutput; i++) {
      let sndBytes = sndDecodes.slice(i * ED25519_KEY_SIZE, (i + 1) * ED25519_KEY_SIZE);
      sndOutputs[i] = checkEncode(sndBytes, ENCODE_VERSION);
    }
  }

  return sndOutputs;
}

export function encryptPaymentMessage(paymentInfoList: PaymentInfoModel[]) {
  // TODO
  return paymentInfoList;
}

export async function sendB58CheckEncodeTxToChain(handler: Function, b58CheckEncodeTx: string) {
  const response: { txId: string } = await handler(b58CheckEncodeTx);

  if (response?.txId) {
    return response;
  }

  throw new Error('Send tx failed');
}


export function getCoinInfoForCache(coins: CoinModel[]) {
  const serialNumberList: string[] = [];
  const listUTXO: string[] = [];

  coins.forEach(coin => {
    serialNumberList.push(coin.serialNumber);
    listUTXO.push(coin.snDerivator);
  });

  return {
    serialNumberList,
    listUTXO
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
  devInfo,
  usePrivacyForPrivacyToken,
  usePrivacyForNativeToken
}: CreateHistoryParam) {
  const history = new TxHistoryModel({
    txId,
    txType,
    lockTime,
    status: SuccessTx,
    nativeTokenInfo: {
      spendingCoinSNs: nativeSpendingCoinSNs,
      listUTXO: nativeListUTXO,
      fee: nativeFee,
      amount: nativePaymentAmount,
      paymentInfoList: nativePaymentInfoList,
      usePrivacy: usePrivacyForNativeToken
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
      privacyTokenTxType
    },
    meta,
    accountPublicKeySerialized,
    devInfo,
  });


  // TODO: handle cache error
  cacheTxHistory(history.txId, history);

  return history;
}