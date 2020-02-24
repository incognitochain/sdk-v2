import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { TxCustomTokenPrivacyType, CustomTokenTransfer } from '@src/services/tx/constants';
import { createTx } from './sendPrivacyToken';
import { BurningRequestMeta } from '../wallet/constants';

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
  if (outchainAddress.startsWith('0x')) {
    return outchainAddress.slice(2);
  }

  return outchainAddress;
}

export default async function sendBurningRequest({
  accountKeySet,
  nativeAvailableCoins,
  privacyAvailableCoins,
  nativeFee,
  privacyFee,
  tokenId,
  tokenSymbol,
  tokenName,
  outchainAddress,
  burningAmount,
} : SendParam) {
  const burningAmountBN = toBNAmount(burningAmount);
  const privacyFeeBN = toBNAmount(privacyFee);
  const nativeFeeBN = toBNAmount(nativeFee);
  const totalBurningAmountBN = burningAmountBN.add(privacyFeeBN);

  const usePrivacyForNativeToken = true;
  const usePrivacyForPrivacyToken = false;
  const nativePaymentInfoList: PaymentInfoModel[] = [];
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
    txType: TxCustomTokenPrivacyType,
    privacyFee,
    privacyListUTXO,
    privacySpendingCoinSNs,
    privacyTokenTxType: CustomTokenTransfer,
    privacyPaymentInfoList,
    privacyPaymentAmount: totalBurningAmountBN.toNumber(),
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    meta: burningReqMetadata,
    devInfo: 'burning request tx -- only for dev',
  });
}