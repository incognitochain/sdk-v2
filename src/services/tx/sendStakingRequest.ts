import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { STAKING_TYPES, TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import { createTx } from './sendNativeToken';
import { checkDecode } from '@src/utils/base58';
import { generateCommitteeKeyFromHashPrivateKey } from '../key/generator';
import { MetaStakingShard } from '@src/constants/wallet';
import Validator from '@src/utils/validator';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';

interface StakingParam {
  candidateAccountKeySet: AccountKeySetModel,
  rewardReceiverPaymentAddress: string,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  autoReStaking: boolean,
};

export default async function sendStakingRequest({
  candidateAccountKeySet,
  rewardReceiverPaymentAddress,
  availableNativeCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  autoReStaking = true
} : StakingParam) {
  new Validator('candidateAccountKeySet', candidateAccountKeySet).required();
  new Validator('rewardReceiverPaymentAddress', rewardReceiverPaymentAddress).required().paymentAddress();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('autoReStaking', autoReStaking).required().boolean();

  const stakingType = STAKING_TYPES.SHARD;
  const usePrivacyForNativeToken = false;
  const stakingAmount = (await rpc.getStakingAmount(stakingType)).res;
  const stakingAmountBN = toBNAmount(stakingAmount);
  const nativeFeeBN = toBNAmount(nativeFee);
  const nativePaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: await getBurningAddress(),
      amount: stakingAmountBN.toNumber(),
      message: ""
    })
  ];
  
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const nativeTxInput = await getNativeTokenTxInput(candidateAccountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);
  const candidateHashPrivateKeyBytes = checkDecode(candidateAccountKeySet.validatorKey).bytesDecoded;
  const committeeKey = await generateCommitteeKeyFromHashPrivateKey(candidateHashPrivateKeyBytes, candidateAccountKeySet.paymentAddress.publicKeyBytes);
  
  console.log('nativeTxInput', nativeTxInput);

  const metaData = {
    Type: MetaStakingShard,
    FunderPaymentAddress: candidateAccountKeySet.paymentAddressKeySerialized,
    RewardReceiverPaymentAddress: rewardReceiverPaymentAddress,
    StakingAmountShard: stakingAmountBN.toNumber(),
    CommitteePublicKey: committeeKey,
    AutoReStaking: autoReStaking,
  };
  
  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: candidateAccountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.staking,
    metaData
  });
  
  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);
  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs,
    txType: TX_TYPE.PRIVACY_TOKEN_WITH_PRIVACY_MODE,
    accountPublicKeySerialized: candidateAccountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    meta: metaData,
    historyType: HISTORY_TYPE.STAKING_REQUEST
  });
}