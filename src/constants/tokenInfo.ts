const NATIVE_TOKEN = {
  tokenId: '0000000000000000000000000000000000000000000000000000000000000004',
  name: 'Privacy',
  symbol: 'PRV'
};

const BRIDGE_PRIVACY_TOKEN = {
  TYPE: {
    COIN: 0,
    TOKEN: 1 // including ERC20, BEP1, BEP2,...
  },
  CURRENCY_TYPE: {
    ETH: 1,
    BTC: 2,
    ERC20: 3,
    BNB: 4,
    BNB_BEP2: 5,
    USD: 6
  },
  ADDRESS_TYPE: {
    DEPOSIT: 1,
    WITHDRAW: 2
  },
  HISTORY_STATUS: {
    CENTRALIZED: {
      // DEPOSIT
      ReceivedDepositAmount: 1,
      MintingPrivacyToken: 2,
      MintedPrivacyToken: 3, // SUCCESS
      SendingToMasterAccount: 4, // SUCCESS
      SendedToMasterAccount: 5, // SUCCESS

      // WITHDRAW
      ReceivedWithdrawAmount: 6,
      BurningPrivacyToken: 7,
      BurnedPrivacyToken: 8,
      SendingToUserAddress: 9,
      SendedToUserAddress: 10, // SUCCESS
      RejectedIssueFromIncognito: 14, // FAILED

      RejectedBurnFromIncognito: 15,// FAILED
      OtaExpired: 16 // EXPIRED
    },
    DECENTRALIZED: {
      // DEPOSIT
      EthReceivedDepositAmount: 1,
      EthRequestAcceptWithDraw: 2,
      EthAcceptedWithDraw: 3,
      EthSendingToContract: 4,
      SentToIncognito: 5,
      RejectedFromIncognito: 6, // FAILED
      EthMintedPrivacyToken: 7, // SUCCESS

      // WITHDRAW
      EthReceivedWithdrawTx: 8,
      FailedGettingBurnProof: 9,
      BurnProofInvalid: 10,
      ReleasingToken: 11,
      ReleaseTokenSucceed: 12, // SUCCESS
      ReleaseTokenFailed: 13, // FAILED

      EtaExpired: 14 // EXPIRED
    },
  },
};

export default {
  NATIVE_TOKEN,
  BRIDGE_PRIVACY_TOKEN
};