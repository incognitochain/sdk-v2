import { FailedTx } from '@src/services/wallet/constants';

// TxHistoryInfo defines structure of history info for all transaction types
// The metaData field is different between transaction types: {Type : number, ...}
// 1. Staking tx:                     metaData.Type:  MetaStakingBeacon || MetaStakingShard
// 2. Burning tx:                     metaData.Type:  BurningRequestMeta  (withdraw pToken decentralized)
// 3. Withdraw reward amount tx:      metaData.Type:  WithDrawRewardRequestMeta 
// 4. Contribution PRV or pToken tx:  metaData.Type:  PDEContributionMeta 
// 5. Trade PRV or pToken tx:         metaData.Type:  PDETradeRequestMeta 
// 6. Withdraw DEX tx:                metaData.Type:  PDEWithdrawalRequestMeta 

// withdraw ptoken centralized tx is ptoken tx without metadata

export class TxHistoryInfo {
  constructor() {
    this.txID = '';
    this.amountNativeToken = 0;
    this.amountPToken = 0;
    this.feeNativeToken = 0;
    this.feePToken = 0;
      
    this.typeTx = '';
    this.receivers = [];
    this.tokenName = '';
    this.tokenID = '';
    this.tokenSymbol = '';
    this.tokenTxType = null; 
    this.isIn = null;
    this.time = '';
    this.status = FailedTx;
    this.isPrivacyNativeToken = false;
    this.isPrivacyForPToken = false;
    this.listUTXOForPRV = [];
    this.listUTXOForPToken = [];
    this.hashOriginalTx = '';

    this.metaData = null; 
    this.info = '';
    this.messageForNativeToken = '';
    this.messageForPToken = '';
  }
  
  setHistoryInfo(historyObject) {
    this.amountNativeToken = historyObject.amountNativeToken;
    this.amountPToken = historyObject.amountPToken;
    this.feeNativeToken = historyObject.feeNativeToken;
    this.feePToken = historyObject.feePToken;
    this.receivers = historyObject.receivers;
    this.txID = historyObject.txID;
    this.typeTx = historyObject.typeTx;
    this.time = new Date(historyObject.time);
    this.isIn = historyObject.isIn;
    this.isPrivacyNativeToken = historyObject.isPrivacyNativeToken;
    this.isPrivacyForPToken = historyObject.isPrivacyForPToken;
    this.status = historyObject.status;

    this.tokenName = historyObject.tokenName;
    this.tokenID = historyObject.tokenID;
    this.tokenSymbol = historyObject.tokenSymbol;
    this.tokenTxType = historyObject.tokenTxType != null ? historyObject.tokenTxType : null;

    this.listUTXOForPRV = historyObject.listUTXOForPRV;
    this.listUTXOForPToken = historyObject.listUTXOForPToken;
    this.hashOriginalTx = historyObject.hashOriginalTx;
    this.metaData = historyObject.metaData ? historyObject.metaData : null;
    this.info = historyObject.info ? historyObject.info : null;
    this.messageForNativeToken = historyObject.messageForNativeToken ? historyObject.messageForNativeToken : null;
    this.messageForPToken = historyObject.messageForPToken ? historyObject.messageForPToken : null;
  }
  
  updateStatus(newStatus) {
    this.status = newStatus;
  }
}
  