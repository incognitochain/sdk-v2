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

export interface TxInputType {
  inputCoinStrs: CoinModel[],
  totalValueInputBN: bn,
  commitmentIndices: number[],
  myCommitmentIndices: number[],
  commitmentStrs: string[],
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

/**
 * Prepare data for sending native token
 * 
 * @param accountKeySet Sender account ket set
 * @param availableNativeCoins  Sender's native coins use to spend
 * @param nativePaymentAmountBN Amount to send
 * @param nativeTokenFeeBN Fee to send (native fee)
 */
export async function getNativeTokenTxInput(accountKeySet: AccountKeySetModel, availableNativeCoins: CoinModel[], nativePaymentAmountBN: bn, nativeTokenFeeBN: bn) : Promise<TxInputType> {
  const paymentAddress = accountKeySet.paymentAddressKeySerialized;
  const totalAmountBN = nativePaymentAmountBN.add(nativeTokenFeeBN);
  const bestCoins = chooseBestCoinToSpent(availableNativeCoins, totalAmountBN);
  const coinsToSpend: CoinModel[] = bestCoins.resultInputCoins;
  const totalValueToSpendBN = getValueFromCoins(coinsToSpend);

  if (totalAmountBN.cmp(totalValueToSpendBN) === 1) {
    throw new Error('Not enough coin');
  }

  const { commitmentIndices, commitmentStrs, myCommitmentIndices } = await rpc.randomCommitmentsProcess(paymentAddress, coinsToSpend);

  // Check number of list of random commitments, list of random commitment indices
  if (commitmentIndices.length !== coinsToSpend.length * CM_RING_SIZE) {
    throw new Error('Invalid random commitments');
  }
  if (myCommitmentIndices.length !== coinsToSpend.length) {
    throw new Error('Number of list my commitment indices must be equal to number of input coins');
  }

  for (let i = 0; i < coinsToSpend.length; i++) {
    // set info for input coin is null
    coinsToSpend[i].info = '';
  }

  return {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpendBN,
    commitmentIndices: commitmentIndices,
    myCommitmentIndices: myCommitmentIndices,
    commitmentStrs: commitmentStrs,
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
export async function getPrivacyTokenTxInput(accountKeySet: AccountKeySetModel, privacyAvailableCoins: CoinModel[], tokenId: TokenIdType, privacyPaymentAmountBN: bn, privacyTokenFeeBN: bn) : Promise<TxInputType> {
  let coinsToSpend: CoinModel[] = [];
  let totalValueToSpentBN = new bn(0);
  let commitmentIndices = [];
  let myCommitmentIndices = [];
  let commitmentStrs = [];

  if (tokenId) {
    const paymentAddress = accountKeySet.paymentAddressKeySerialized;
    const totalAmountBN = privacyPaymentAmountBN.add(privacyTokenFeeBN);
    const bestCoins = chooseBestCoinToSpent(privacyAvailableCoins, totalAmountBN);

    coinsToSpend = bestCoins.resultInputCoins;
    totalValueToSpentBN = getValueFromCoins(coinsToSpend);

    if (totalAmountBN.cmp(totalValueToSpentBN) === 1) {
      throw new Error('Not enough coin');
    }

    const commitmentData = await rpc.randomCommitmentsProcess(paymentAddress, coinsToSpend, tokenId);
    commitmentIndices = commitmentData.commitmentIndices;
    myCommitmentIndices = commitmentData.myCommitmentIndices;
    commitmentStrs = commitmentData.commitmentStrs;

    // Check number of list of random commitments, list of random commitment indices
    if (commitmentIndices.length !== coinsToSpend.length * CM_RING_SIZE) {
      throw new Error('Invalid random commitments');
    }
    if (myCommitmentIndices.length !== coinsToSpend.length) {
      throw new Error('Number of list my commitment indices must be equal to number of input coins');
    }

    for (let i = 0; i < coinsToSpend.length; i++) {
      // set info for input coin is null
      coinsToSpend[i].info = '';
    }
  }
  
  return {
    inputCoinStrs: coinsToSpend,
    totalValueInputBN: totalValueToSpentBN,
    commitmentIndices: commitmentIndices,
    myCommitmentIndices: myCommitmentIndices,
    commitmentStrs: commitmentStrs,
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
  const response = await handler(b58CheckEncodeTx);

  if (!response?.txId) {
    throw new Error('Send tx failed');
  }

  return response;
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