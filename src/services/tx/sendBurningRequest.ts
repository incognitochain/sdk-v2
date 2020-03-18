import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { PRIVACY_TOKEN_TX_TYPE, TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import { createTx } from './sendPrivacyToken';
import { BurningRequestMeta } from '@src/constants/wallet';
import Validator from '@src/utils/validator';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface TokenInfo {
  tokenId: TokenIdType,
  tokenSymbol: TokenSymbolType,
  tokenName: TokenNameType,
};

interface SendParam extends TokenInfo {
  accountKeySet: AccountKeySetModel,
  nativeAvailableCoins: CoinModel[],
  privacyAvailableCoins: CoinModel[],
  nativeFee: number,
  privacyFee: number,
  outchainAddress: string,
  burningAmount: number
};

function parseOutchainAddress(outchainAddress: string) {
  new Validator('outchainAddress', outchainAddress).required().string();

  if (outchainAddress.startsWith('0x')) {
    return outchainAddress.slice(2);
  }

  return outchainAddress;
}

export default async function sendBurningRequest({
  accountKeySet,
  nativeAvailableCoins,
  privacyAvailableCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  privacyFee,
  tokenId,
  tokenSymbol,
  tokenName,
  outchainAddress,
  burningAmount,
} : SendParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('nativeAvailableCoins', nativeAvailableCoins).required();
  new Validator('privacyAvailableCoins', privacyAvailableCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('privacyFee', privacyFee).required().amount();
  new Validator('tokenId', tokenId).required().string();
  new Validator('tokenSymbol', tokenSymbol).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('outchainAddress', outchainAddress).required().string();
  new Validator('burningAmount', burningAmount).required().amount();

  const burningAmountBN = toBNAmount(burningAmount);
  const privacyFeeBN = toBNAmount(privacyFee);
  const nativeFeeBN = toBNAmount(nativeFee);
  const totalBurningAmountBN = burningAmountBN.add(privacyFeeBN);

  const usePrivacyForNativeToken = true;
  const usePrivacyForPrivacyToken = false;
  const nativePaymentInfoList: PaymentInfoModel[] = null;
  const outchainAddressParsed = parseOutchainAddress(outchainAddress);
  const burningAddress = await getBurningAddress();
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: burningAddress,
      amount: totalBurningAmountBN.toNumber(),
      message: ''
    })
  ];

  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(privacyFee);
  const privacyPaymentAmountBN = getTotalAmountFromPaymentList(privacyPaymentInfoList);
  
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, nativeAvailableCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);
  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, privacyAvailableCoins, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN, usePrivacyForPrivacyToken);
  console.log('privacyTxInput', privacyTxInput);

  const burningReqMetadata = {
    BurnerAddress: accountKeySet.paymentAddressKeySerialized,
    BurningAmount: totalBurningAmountBN.toNumber(),
    TokenID: tokenId,
    TokenName: tokenName,
    RemoteAddress: outchainAddressParsed,
    Type: BurningRequestMeta
  };

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privacyTxInput,
    privacyPaymentInfoList,
    privacyTokenFeeBN,
    privacyPaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    tokenId,
    tokenSymbol,
    tokenName,
    usePrivacyForNativeToken,
    usePrivacyForPrivacyToken,
    metaData: burningReqMetadata,
    initTxMethod: goMethods.initBurningRequestTx
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTxCustomTokenPrivacy, txInfo.b58CheckEncodeTx);

  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  const { serialNumberList: privacySpendingCoinSNs, listUTXO: privacyListUTXO } = getCoinInfoForCache(privacyTxInput.inputCoinStrs);

  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs,
    tokenSymbol,
    tokenName,
    tokenId: txInfo.tokenID,
    txType: TX_TYPE.PRIVACY_TOKEN_WITH_PRIVACY_MODE,
    privacyFee,
    privacyListUTXO,
    privacySpendingCoinSNs,
    privacyTokenTxType: PRIVACY_TOKEN_TX_TYPE.TRANSFER,
    privacyPaymentInfoList,
    privacyPaymentAmount: totalBurningAmountBN.toNumber(),
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    meta: burningReqMetadata,
    historyType: HISTORY_TYPE.BURNING_REQUEST
  });
}