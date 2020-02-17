function parseStackTrace(detailError: any) {
  let stackTrace;
  let stackTraceCode;
  if (detailError && typeof detailError === 'object') {
    if (detailError.StackTrace) {
      stackTrace = detailError.StackTrace;
      if (detailError.StackTrace.match(/-[0-9]+: -[0-9]+/)) {
        stackTraceCode = detailError.StackTrace.match(/-[0-9]+: -[0-9]+/)[0];
      } else if (detailError.StackTrace.match(/-[0-9]+/)) {
        stackTraceCode = detailError.StackTrace.match(/-[0-9]+/)[0];
      } else {
        stackTraceCode = detailError.Code;
      }
    } else if (detailError.response) {
      stackTrace = detailError.message;
      stackTraceCode = detailError.response.status;
    }
  }

  return { stackTrace, stackTraceCode };
}

class CustomError extends Error {
  code: any;
  description: any;
  date: any;
  stackTrace: any;
  stackTraceCode: any;

  constructor(errorObj: any, message: any, detailError?: any) {
    super(message);
    this.name = 'WEB_JS_ERROR';
    this.code = `${this.name}(${errorObj.code})`;
    this.description = errorObj.description;
    this.date = new Date();

    const { stackTrace, stackTraceCode } = parseStackTrace(detailError);

    this.stackTrace = stackTrace;
    this.stackTraceCode = stackTraceCode;
  }
}

class RPCError extends Error {
  code: any;
  description: any;
  stackTrace: any;
  stackTraceCode: any;

  constructor(method: any, detailError: any) {
    super(method);
    this.name = method;
    this.code = `${this.name}(${detailError.Code})`;
    this.description = detailError.Message;

    const { stackTrace, stackTraceCode } = parseStackTrace(detailError);

    this.stackTrace = stackTrace;
    this.stackTraceCode = stackTraceCode;
  }
}

const ErrorObject = {
  // -1 -> -1000: util error
  UnexpectedErr: { code: -1, description: 'Unexpected error' },
  B58CheckDeserializedErr: { code: -2, description: 'Base58 check deserialized error' },
  B58CheckSerializedErr: { code: -3, description: 'Base58 check serialized error' },
  ChooseBestCoinErr: { code: -4, description: 'Choose best coin to spend error' },
  NotEnoughCoinError: { code: -5, description: 'Not enough coin to spend' },
  NotEnoughTokenError: { code: -6, description: 'Not enough token to spend' },
  InvalidBurnAddress: { code: -7, description: 'Burning address is invalid' },


  // -2000 -> -2999: wallet error
  WrongPassPhraseErr: { code: -2000, description: 'Passphrase is not correct' },
  ExistedAccountErr: { code: -2001, description: 'Account was existed' },
  LoadWalletErr: { code: -2002, description: 'Can not load wallet' },
  NewEntropyErr: { code: -2003, description: 'New entropy error' },
  DeleteWalletErr: { code: -2004, description: 'New entropy error' },
  PrivateKeyInvalidErr: { code: -2005, description: 'Private key is invalid when importing account' },
  MnemonicInvalidErr: { code: -2006, description: 'Length mnemonic words is invalid' },



  // -3000 -> -3999: transaction error
  PrepareInputNormalTxErr: { code: -3000, description: 'Prepare input coins for normal transaction error' },
  InitNormalTxErr: { code: -3001, description: 'Can not init normal transaction' },
  SendTxErr: { code: -3002, description: 'Can not send transaction' },
  InitWithrawRewardTxErr: { code: -3003, description: 'Can not init withdraw reward transaction' },
  GetTxByHashErr: { code: -3004, description: 'Can not get transaction by hash' },
  InvalidNumberUTXOToDefragment: { code: -3005, description: 'The number of UTXO need to be defragmented is so small' },
  TxSizeExceedErr: { code: -3006, description: 'Tx size is too large' },
  InitCustomTokenTxErr: { code: -3007, description: 'Can not init custom token transaction' },
  InitPrivacyTokenTxErr: { code: -3008, description: 'Can not init privacy token transaction' },
  EncryptMsgOutCoinErr: { code: -3009, description: 'Can not encrypt message of output coins' },
  InvalidTypeTXToReplaceErr: { code: -3010, description: 'Invalid tx type for replacing' },

  // -4000 -> -4999: RPC error
  GetStakingAmountErr: { code: -4000, description: 'Can not get staking amount' },
  GetRewardAmountErr: { code: -4001, description: 'Can not get reward amount' },
  GetOutputCoinsErr: { code: -4002, description: 'Can not get list of output coins' },
  GetMaxShardNumberErr: { code: -4003, description: 'Can not get max shard number' },
  GetListCustomTokenErr: { code: -4004, description: 'Can not get list of custom tokens' },
  GetListPrivacyTokenErr: { code: -4005, description: 'Can not get list of privacy tokens' },
  GetUnspentCustomTokenErr: { code: -4006, description: 'Can not get list of unspent custom tokens' },
  GetUnspentPrivacyTokenErr: { code: -4007, description: 'Can not get list of unspent privacy tokens' },
  GetUnspentCoinErr: { code: -4008, description: 'Can not get list of unspent coins' },
  GetUnitFeeErr: { code: -4009, description: 'Can not get unit fee' },
  GetActiveShardErr: { code: -4011, description: 'Can not get active shard' },
  HashToIdenticonErr: { code: -4012, description: 'Can not generate identicon from hash' },
};

export {
  CustomError, ErrorObject,
  RPCError,
};
