export const TxVersion = 1;

export const PRIVACY_TOKEN_TX_TYPE = {
  INIT: 0,
  TRANSFER: 1
};

/**
 * @property NORMAL normal tx(send and receive coin)
 * @property SALARY salary tx(gov pay salary for block producer)
 * @property PRIVACY_TOKEN_WITHOUT_PRIVACY_MODE token  tx with no supporting privacy
 * @property PRIVACY_TOKEN_WITH_PRIVACY_MODE token  tx with supporting privacy
 */
export const TX_TYPE = {
  NORMAL: 'n',
  SALARY: 's',
  PRIVACY_TOKEN_WITHOUT_PRIVACY_MODE: 't',
  PRIVACY_TOKEN_WITH_PRIVACY_MODE: 'tp'
};

export const STAKING_TYPES = {
  SHARD: 0,
  BEACON: 1
};

export const TX_STATUS = {
  FAILED: 0,
  SUCCESS: 1,
  CONFIRMED: 2,
};

export const HISTORY_TYPE = {
  ISSUE_TOKEN: 0,
  SEND_NATIVE_TOKEN: 1,
  SEND_PRIVACY_TOKEN: 2,
  BURNING_REQUEST: 3,
  PDE_CONTRIBUTION_NATIVE_TOKEN: 4,
  PDE_CONTRIBUTION_PRIVACY_TOKEN: 5,
  PDE_TRADE_REQUEST_NATIVE_TOKEN: 6,
  PDE_TRADE_REQUEST_PRIVACY_TOKEN: 7,
  STAKING_REQUEST: 8,
  WITHDRAW_REWARD: 9,
  DEFRAGMENT_NATIVE_TOKEN: 10
};

export const MaxInputNumberForDefragment = 32;

export const MaxInfoSize = 512;