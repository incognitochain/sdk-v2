import { getTotalAmountFromPaymentList, getNativeTokenTxInput, toBNAmount, sendB58CheckEncodeTxToChain, getCoinInfoForCache, getPrivacyTokenTxInput, createHistoryInfo, getBurningAddress } from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { TxCustomTokenPrivacyType, STAKING_TYPES } from '@src/services/tx/constants';
import { createTx } from './sendNativeToken';
import { checkDecode } from '@src/utils/base58';
import { generateCommitteeKeyFromHashPrivateKey } from '../key/generator';
import { MetaStakingShard } from '../wallet/constants';

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
  nativeFee,
  autoReStaking = true
} : StakingParam) {
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
    txType: TxCustomTokenPrivacyType,
    accountPublicKeySerialized: candidateAccountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    meta: metaData,
    devInfo: 'staking request'
  });
}