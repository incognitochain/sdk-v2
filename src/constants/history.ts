export const HISTORY = {
  TYPE: {
    SHIELD: 1, // same with PRIVATE_TOKEN_HISTORY_ADDRESS_TYPE.DEPOSIT
    UNSHIELD: 2, // same with PRIVATE_TOKEN_HISTORY_ADDRESS_TYPE.WITHDRAW
    SEND: 3, // custom
    RECEIVE: 4, // custom,
    PROVIDE: -999,
  },
  STATUS_TEXT: {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    PENDING: 'PENDING',
    EXPIRED: 'EXPIRED',
  },
  META_DATA_TYPE: {
    44: 'Node withdraw',
    63: 'Stake',
    90: 'Add liquidity',
    93: 'Remove liquidity',
    27: 'Unshield',
    127: 'Unstake',
    240: 'Unshield',
  },
  STATUS_CODE: {
    PENDING: 0,
  },
  //shield decentralized
  STATUS_CODE_SHIELD_DECENTRALIZED: {
    PENDING: 0,
    PROCESSING: [1, 2, 3, 4, 5],
    COMPLETE: 7,
    TIMED_OUT: 14,
    RETRYING: 6,
  },
  //shield centralized
  STATUS_CODE_SHIELD_CENTRALIZED: {
    PENDING: 0,
    PROCESSING: [1, 2],
    COMPLETE: [3, 5],
    TIMED_OUT: [14, 16],
  },
  //unshield decentralized
  STATUS_CODE_UNSHIELD_DECENTRALIZED: {
    PROCESSING: [8, 11],
    FAILED: [9, 15],
    COMPLETE: 12,
    RETRYING: [10, 13],
    TIMED_OUT: 14,
  },
  //unshield centralized
  STATUS_CODE_UNSHIELD_CENTRALIZED: {
    PENDING: 0,
    PROCESSING: [6, 7, 8, 9],
    COMPLETE: 10,
    RETRYING: 15,
    TIMED_OUT: 16,
  },
  TYPE_HISTORY_RECEIVE: {
    41: 'Unstake Node',
    45: 'Node withdraw',
    81: 'Shield', //decentralized
    94: 'Remove liquidity',
    95: 'Add liquidity',
    96: 'Shield Amount',
    25: 'Shield', //centralized
    92: 'Trade',
  },
};
