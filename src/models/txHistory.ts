import PaymentInfoModel from './paymentInfo';

// TxHistory defines structure of history info for all transaction types
// The metaData field is different between transaction types: {Type : number, ...}
// 1. Staking tx:                     metaData.Type:  MetaStakingBeacon || MetaStakingShard
// 2. Burning tx:                     metaData.Type:  BurningRequestMeta  (withdraw pToken decentralized)
// 3. Withdraw reward amount tx:      metaData.Type:  WithDrawRewardRequestMeta
// 4. Contribution PRV or pToken tx:  metaData.Type:  PDEContributionMeta
// 5. Trade PRV or pToken tx:         metaData.Type:  PDETradeRequestMeta
// 6. Withdraw DEX tx:                metaData.Type:  PDEWithdrawalRequestMeta

// withdraw ptoken centralized tx is ptoken tx without metadata

interface NativeTokenHistoryInfo {
  fee: string;
  amount: string;
  paymentInfoList: PaymentInfoModel[];
  usePrivacy: boolean;
  spendingCoinSNs: string[];
  listUTXO: string[];
}

interface PrivacyTokenHistoryInfo extends NativeTokenHistoryInfo {
  tokenId: TokenIdType;
  tokenName: TokenNameType;
  tokenSymbol: TokenSymbolType;
  privacyTokenTxType: number;
}

export interface TxHistoryModelParam {
  txId: string;
  txType: string;
  lockTime: number;
  status: number;
  nativeTokenInfo: NativeTokenHistoryInfo;
  privacyTokenInfo?: PrivacyTokenHistoryInfo;
  meta?: any;
  accountPublicKeySerialized: string;
  historyType?: number;
  memo?: string;
}

export default class TxHistoryModel {
  txId: string;
  txType: string;
  lockTime: number;
  status: number;
  nativeTokenInfo: NativeTokenHistoryInfo;
  privacyTokenInfo: PrivacyTokenHistoryInfo;
  meta: any;
  accountPublicKeySerialized: string;
  historyType: number;
  memo?: string;
  constructor({
    txId,
    txType,
    lockTime,
    status,
    nativeTokenInfo,
    privacyTokenInfo,
    meta,
    accountPublicKeySerialized,
    historyType,
    memo,
  }: TxHistoryModelParam) {
    this.txId = txId;
    this.txType = txType;
    this.lockTime = lockTime;
    this.status = status;
    this.nativeTokenInfo = nativeTokenInfo;
    this.privacyTokenInfo = privacyTokenInfo;
    this.meta = meta;
    this.accountPublicKeySerialized = accountPublicKeySerialized;
    this.historyType = historyType;
    this.memo = memo;
  }

  toJson() {
    return {
      txId: this.txId,
      txType: this.txType,
      lockTime: this.lockTime,
      status: this.status,
      nativeTokenInfo: this.nativeTokenInfo,
      privacyTokenInfo: this.privacyTokenInfo,
      meta: this.meta,
      accountPublicKeySerialized: this.accountPublicKeySerialized,
      historyType: this.historyType,
      memo: this.memo,
    };
  }
}
