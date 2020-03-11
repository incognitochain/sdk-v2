import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { PRIVACY_TOKEN_TX_TYPE, TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import { extractInfoFromInitedTxBytes as customExtractInfoFromInitedTxBytes } from '@src/services/tx/sendNativeToken';
import { createTx } from './sendPrivacyToken';
import { PDEContributionMeta } from '@src/constants/wallet';
import Validator from '@src/utils/validator';

interface ContributionParam {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  privacyAvailableCoins: CoinModel[],
  nativeFee: number,
  privacyFee: number,
  pdeContributionPairID: string,
  contributedAmount: number,
  tokenId: TokenIdType,
  tokenName: TokenNameType,
  tokenSymbol: TokenSymbolType,
};

export default async function sendPrivacyTokenPdeContribution({
  accountKeySet,
  availableNativeCoins,
  privacyAvailableCoins,
  nativeFee,
  privacyFee,
  pdeContributionPairID,
  tokenId,
  tokenName,
  tokenSymbol,
  contributedAmount,
} : ContributionParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('privacyAvailableCoins', privacyAvailableCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('privacyFee', privacyFee).required().amount();
  new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
  new Validator('tokenId', tokenId).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('tokenSymbol', tokenSymbol).required().string();
  new Validator('contributedAmount', contributedAmount).required().amount();

  const usePrivacyForPrivacyToken = false;
  const usePrivacyForNativeToken = false;
  const nativePaymentInfoList = <PaymentInfoModel[]>[];
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(privacyFee);
  const contributedAmountBN = toBNAmount(contributedAmount);
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: await getBurningAddress(),
      amount: contributedAmountBN.toNumber(),
      message: ''
    })
  ];
  const privacyPaymentAmountBN = getTotalAmountFromPaymentList(privacyPaymentInfoList);
  
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);

  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, privacyAvailableCoins, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN, usePrivacyForPrivacyToken);
  console.log('privacyTxInput', privacyTxInput);

  const metaData = {
    PDEContributionPairID: pdeContributionPairID,
    ContributorAddressStr: accountKeySet.paymentAddressKeySerialized,
    ContributedAmount: contributedAmount,
    TokenIDStr: tokenId,
    Type: PDEContributionMeta
  };

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
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initPTokenContributionTx,
    metaData,
    privacyTokenParamAdditional: {
    },
    customExtractInfoFromInitedTxMethod: customExtractInfoFromInitedTxBytes
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
    tokenId,
    txType: TX_TYPE.PRIVACY_TOKEN_WITH_PRIVACY_MODE,
    privacyTokenTxType: PRIVACY_TOKEN_TX_TYPE.TRANSFER,
    privacyPaymentInfoList,
    privacyPaymentAmount: privacyPaymentAmountBN.toNumber(),
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    usePrivacyForPrivacyToken,
    privacySpendingCoinSNs,
    privacyListUTXO,
    meta: metaData,
    privacyFee,
    historyType: HISTORY_TYPE.PDE_CONTRIBUTION_PRIVACY_TOKEN
  });
}