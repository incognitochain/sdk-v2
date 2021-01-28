import {
  centralizedWithdraw,
  decentralizedWithdraw,
  checkValidAddress,
} from '@src/services/bridge/withdraw';
import { getMinMaxDepositAmount } from '@src/services/bridge/deposit';
import Token from './token';
import PrivacyTokenModel from '@src/models/token/privacyToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendPrivacyToken, {
  hasExchangeRate,
} from '@src/services/tx/sendPrivacyToken';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendBurningRequest from '@src/services/tx/sendBurningRequest';
import sendPrivacyTokenPdeContribution from '@src/services/tx/sendPrivacyTokenPdeContribution';
import sendPrivacyTokenPdeTradeRequest from '@src/services/tx/sendPrivacyTokenPdeTradeRequest';
import Validator from '@src/utils/validator';
import PrivacyTokenApiModel, {
  BridgeInfoInterface,
} from '@src/models/bridge/privacyTokenApi';
import { TokenInfo } from '@src/constants';
import {
  genETHDepositAddress,
  genERC20DepositAddress,
  genCentralizedDepositAddress,
} from '@src/services/bridge/deposit';
import {
  getBridgeHistory,
  removeBridgeHistory,
  retryBridgeHistory,
  getBridgeHistoryById,
} from '@src/services/bridge/history';
import {
  estUserFeeCentralizedWithdraw,
  estUserFeeDecentralizedWithdraw,
} from '@src/services/bridge/withdraw';
import { getEstFeeFromChain } from '@src/services/bridge/token';

interface PrivacyTokenParam {
  privacyTokenApi: PrivacyTokenApiModel;
  accountKeySet: AccountKeySetModel;
}
interface IMinMaxToken {
  TokenID: string;
  Symbol: string;
  PSymbol: string;
  MinAmount: number;
  MaxAmount: number;
}

class PrivacyToken extends Token implements PrivacyTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  isPrivacyToken: boolean;
  totalSupply: string;
  bridgeInfo: BridgeInfoInterface;

  constructor({ accountKeySet, privacyTokenApi }: PrivacyTokenParam) {
    new Validator('accountKeySet', accountKeySet).required();
    new Validator('privacyTokenApi', privacyTokenApi).required();

    super({
      accountKeySet,
      tokenId: privacyTokenApi.tokenId,
      name: privacyTokenApi.name,
      symbol: privacyTokenApi.symbol,
    });

    this.totalSupply = privacyTokenApi.supplyAmount;
    this.isPrivacyToken = true;
    this.bridgeInfo = privacyTokenApi.bridgeInfo;
  }

  get bridgeErc20Token() {
    return (
      this.bridgeInfo?.currencyType ===
      TokenInfo.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE.ERC20
    );
  }

  get bridgeEthereum() {
    return (
      this.bridgeInfo?.currencyType ===
      TokenInfo.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE.ETH
    );
  }

  get bridgeBinance() {
    return (
      this.bridgeInfo?.currencyType ===
      TokenInfo.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE.BNB
    );
  }

  get bridgeBEP2() {
    return (
      this.bridgeInfo?.currencyType ===
      TokenInfo.BRIDGE_PRIVACY_TOKEN.CURRENCY_TYPE.BNB_BEP2
    );
  }

  get bridgeDecentralized() {
    return this.bridgeErc20Token || this.bridgeEthereum;
  }

  get bridgeDecentralizedNumber() {
    return this.bridgeDecentralized ? 1 : 0;
  }

  async hasExchangeRate() {
    return await hasExchangeRate(this.tokenId);
  }

  async getNativeAvailableCoins() {
    return this.getAvailableCoins(null);
  }

  async transfer({
    paymentInfoList,
    nativeFee,
    privacyFee,
    memo,
    txIdHandler,
  }: {
    paymentInfoList: PaymentInfoModel[];
    nativeFee?: string;
    privacyFee?: string;
    memo?: string;
    txIdHandler?: (txId: string) => void;
  }) {
    try {
      new Validator('paymentList', paymentInfoList)
        .required()
        .paymentInfoList();
      new Validator('nativeFee', nativeFee).amount();
      new Validator('privacyFee', privacyFee).amount();
      new Validator('memo', memo).string();
      L.info('Privacy token transfer', {
        paymentInfoList,
        nativeFee,
        privacyFee,
        memo,
      });
      const history = await sendPrivacyToken({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        privacyFee,
        privacyPaymentInfoList: paymentInfoList,
        tokenId: this.tokenId,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        memo,
        txIdHandler,
      });
      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} transfered failed`, e);
      throw e;
    }
  }

  async pdeContribution(
    pdeContributionPairID: string,
    contributedAmount: string,
    nativeFee: string,
    privacyFee: string
  ) {
    try {
      new Validator('pdeContributionPairID', pdeContributionPairID)
        .required()
        .string();
      new Validator('contributedAmount', contributedAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();

      L.info(`Privacy token ${this.tokenId} sent PDE contribution request`, {
        pdeContributionPairID,
        contributedAmount,
        nativeFee,
        privacyFee,
      });

      const history = await sendPrivacyTokenPdeContribution({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        pdeContributionPairID,
        tokenId: this.tokenId,
        contributedAmount,
        privacyFee,
        tokenSymbol: this.symbol,
        tokenName: this.name,
      });

      L.info(
        `Privacy token ${this.tokenId} sent PDE contribution request successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error(
        `Privacy token ${this.tokenId} sent PDE contribution request failed`,
        e
      );
      throw e;
    }
  }

  async requestTrade(
    tokenIdBuy: TokenIdType,
    sellAmount: string,
    minimumAcceptableAmount: string,
    nativeFee: string,
    privacyFee: string,
    tradingFee: string
  ) {
    try {
      new Validator('tokenIdBuy', tokenIdBuy).required().string();
      new Validator('sellAmount', sellAmount).required().amount();
      new Validator('minimumAcceptableAmount', minimumAcceptableAmount)
        .required()
        .amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
      new Validator('tradingFee', tradingFee).required().amount();

      L.info(`Privacy token ${this.tokenId} sent trade request`, {
        tokenIdBuy,
        sellAmount,
        minimumAcceptableAmount,
        nativeFee,
        privacyFee,
        tradingFee,
      });

      const history = await sendPrivacyTokenPdeTradeRequest({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        tradingFee,
        privacyFee,
        tokenIdBuy,
        sellAmount,
        minimumAcceptableAmount,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        tokenId: this.tokenId,
      });

      L.info(
        `Privacy token ${this.tokenId} sent trade request successfully with tx id ${history.txId}`
      );

      return history;
    } catch (e) {
      L.error(`Privacy token ${this.tokenId} sent trade request failed`, e);
      throw e;
    }
  }

  async getEstFeeFromNativeFee({ nativeFee }: { nativeFee: number }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      return getEstFeeFromChain({ Prv: nativeFee, TokenID: this.tokenId });
    } catch (error) {
      throw error;
    }
  }

  // bridge shield
  async bridgeGenerateDepositAddress({
    signPublicKey = '',
  }: {
    signPublicKey?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support deposit function`
        );
      }
      new Validator('signPublicKey', signPublicKey).string();
      L.info('Create deposit request', {
        tokenId: this.tokenId,
        currencyType: this.bridgeInfo.currencyType,
        paymentAddress: this.accountKeySet.paymentAddressKeySerialized,
        signPublicKey,
      });
      let task: any[] = [getMinMaxDepositAmount()];
      const commonParams = {
        paymentAddress: this.accountKeySet.paymentAddressKeySerialized,
        walletAddress: this.accountKeySet.paymentAddressKeySerialized,
        tokenId: this.tokenId,
        currencyType: this.bridgeInfo.currencyType,
        signPublicKey,
      };
      if (this.bridgeEthereum) {
        task.push(genETHDepositAddress(commonParams));
      } else if (this.bridgeErc20Token) {
        task.push(
          genERC20DepositAddress({
            ...commonParams,
            tokenContractID: this.bridgeInfo.contractID,
          })
        );
      } else {
        task.push(genCentralizedDepositAddress(commonParams));
      }
      const [minMaxTokens, tempAddress] = await Promise.all(task);
      const findMinMaxToken = minMaxTokens.find(
        (token: IMinMaxToken) => token?.TokenID === this.tokenId
      );
      const payload: any = {
        address: tempAddress,
        minAmount: findMinMaxToken?.MinAmount,
        maxAmount: findMinMaxToken?.MaxAmount,
      };
      L.info(`Generated temp deposit address successfully:`, payload);
      return payload;
    } catch (e) {
      L.error('Generated temp deposit address failed', e);
      throw e;
    }
  }

  // bridge history
  async bridgeGetHistory({ signPublicKey }: { signPublicKey?: string }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('signPublicKey', signPublicKey).string();
      const histories = await getBridgeHistory({
        walletAddress: this.accountKeySet.paymentAddressKeySerialized,
        tokenId: this.tokenId,
        signPublicKey,
      });
      L.info('Get bridge history successfully');
      return histories;
    } catch (e) {
      L.error('Get bridge history failed', e);
      throw e;
    }
  }

  async bridgeRetryHistory({
    id,
    addressType,
    privacyTokenAddress,
    signPublicKey,
  }: {
    id: number;
    addressType: number;
    privacyTokenAddress: string;
    signPublicKey?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('id', id).required().number();
      new Validator('addressType', addressType).required().number();
      new Validator('privacyTokenAddress', privacyTokenAddress)
        .required()
        .string();
      new Validator('signPublicKey', signPublicKey).string();
      const paymentAddress = this.accountKeySet.paymentAddressKeySerialized;
      const payload = {
        id,
        decentralized: this.bridgeDecentralizedNumber,
        walletAddress: paymentAddress,
        addressType,
        currencyType: this.bridgeInfo.currencyType,
        userPaymentAddress: paymentAddress,
        privacyTokenAddress,
        signPublicKey,
      };
      return await retryBridgeHistory(payload);
    } catch (e) {
      throw e;
    }
  }

  async bridgeRemoveHistory({
    id,
    signPublicKey,
  }: {
    id: number;
    signPublicKey?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('id', id).required().number();
      new Validator('signPublicKey', signPublicKey).string();
      return await removeBridgeHistory({
        id,
        currencyType: this.bridgeInfo.currencyType,
        decentralized: this.bridgeDecentralizedNumber,
        signPublicKey,
        tokenId: this.tokenId,
        walletAddress: this.accountKeySet.paymentAddressKeySerialized,
        paymentAddress: this.accountKeySet.paymentAddressKeySerialized,
      });
    } catch (e) {
      throw e;
    }
  }

  async bridgeGetHistoryById({
    signPublicKey,
    historyId,
  }: {
    signPublicKey?: string;
    historyId: number;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('signPublicKey', signPublicKey).string();
      new Validator('historyId', historyId).number().required();
      const history = await getBridgeHistoryById({
        id: historyId,
        currencyType: this.bridgeInfo.currencyType,
        signPublicKey,
        decentralized: this.bridgeDecentralizedNumber,
      });
      L.info('Get bridge history successfully');
      return history;
    } catch (e) {
      L.error('Get bridge history failed', e);
      throw e;
    }
  }

  // bridge withdraw

  async bridgeWithdrawEstUserFee({
    requestedAmount,
    incognitoAmount,
    paymentAddress,
    memo,
    signPublicKey,
  }: {
    requestedAmount: string;
    incognitoAmount: string;
    paymentAddress: string;
    memo?: string;
    signPublicKey?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('signPublicKey', signPublicKey).string();
      new Validator('incognitoAmount', incognitoAmount).required().amount();
      new Validator('requestedAmount', requestedAmount).amount().required();
      new Validator('paymentAddress', paymentAddress).string().required();
      new Validator('memo', memo).string();
      new Validator('signPublicKey', signPublicKey).string();
      const { currencyType, contractID } = this.bridgeInfo;
      const tokenId = this.tokenId;
      const walletAddress = this.accountKeySet.paymentAddressKeySerialized;
      if (this.bridgeDecentralized) {
        return estUserFeeDecentralizedWithdraw({
          tokenId: this.tokenId,
          currencyType,
          requestedAmount,
          incognitoAmount,
          paymentAddress,
          walletAddress,
          erc20TokenAddress: contractID,
          signPublicKey,
        });
      }
      return estUserFeeCentralizedWithdraw({
        incognitoAmount,
        requestedAmount,
        paymentAddress,
        tokenId,
        currencyType,
        memo,
        walletAddress,
        signPublicKey,
      });
    } catch (e) {
      throw e;
    }
  }

  async bridgeBurningDecentralized({
    outchainAddress,
    burningAmount,
    nativeFee,
    privacyFee,
    privacyPaymentInfoList,
    nativePaymentInfoList,
    memo,
    txIdHandler
  }: {
    outchainAddress: string;
    burningAmount: string;
    nativeFee: string;
    privacyFee: string;
    privacyPaymentInfoList: PaymentInfoModel[];
    nativePaymentInfoList?: PaymentInfoModel[];
    memo?: string;
    txIdHandler?: (txId: string) => void;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      L.info(`Privacy token ${this.tokenId} send burning request`, {
        outchainAddress,
        burningAmount,
        nativeFee,
        privacyFee,
        memo,
        privacyPaymentInfoList,
        nativePaymentInfoList,
      });
      new Validator('outchainAddress', outchainAddress).required().string();
      new Validator('burningAmount', burningAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('privacyFee', privacyFee).required().amount();
      new Validator(
        'privacyPaymentInfoList',
        privacyPaymentInfoList
      ).paymentInfoList();
      new Validator(
        'nativePaymentInfoList',
        nativePaymentInfoList
      ).paymentInfoList();
      new Validator('memo', memo).string();
      const history = await sendBurningRequest({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        privacyFee,
        tokenId: this.tokenId,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        outchainAddress,
        burningAmount,
        subNativePaymentInfoList: nativePaymentInfoList || [],
        subPrivacyPaymentInfoList: privacyPaymentInfoList || [],
        memo,
        txIdHandler
      });
      L.info(
        `Privacy token ${this.tokenId} send burning request successfully with tx id ${history.txId}`
      );
      return history;
    } catch (e) {
      throw e;
    }
  }

  async bridgeBurningCentralized({
    privacyPaymentInfoList,
    nativePaymentInfoList,
    nativeFee,
    privacyFee,
    memo,
  }: {
    privacyPaymentInfoList: PaymentInfoModel[];
    nativePaymentInfoList?: PaymentInfoModel[];
    nativeFee?: string;
    privacyFee?: string;
    memo?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('privacyPaymentInfoList', privacyPaymentInfoList)
        .required()
        .paymentInfoList();
      new Validator(
        'nativePaymentInfoList',
        nativePaymentInfoList
      ).paymentInfoList();
      new Validator('nativeFee', nativeFee).amount();
      new Validator('privacyFee', privacyFee).amount();
      new Validator('memo', memo).string();
      L.info('Privacy token transfer', {
        nativePaymentInfoList,
        privacyPaymentInfoList,
        nativeFee,
        privacyFee,
        memo,
      });
      const history = await sendPrivacyToken({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getNativeAvailableCoins(),
        privacyAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        privacyFee,
        privacyPaymentInfoList,
        nativePaymentInfoList,
        tokenId: this.tokenId,
        tokenName: this.name,
        tokenSymbol: this.symbol,
        memo,
      });
      L.info(
        `Privacy token ${this.tokenId} send burning request successfully with tx id ${history.txId}`
      );
      return history;
    } catch (error) {
      throw error;
    }
  }

  async bridgeWithdrawCentralized({
    burningTxId,
    userFeeSelection,
    userFeeLevel,
    tempAddress,
    privacyFee,
    nativeFee,
    signPublicKey,
  }: {
    burningTxId: string;
    userFeeSelection: number;
    userFeeLevel: number;
    tempAddress: string;
    privacyFee?: string;
    nativeFee?: string;
    signPublicKey?: string;
  }) {
    try {
      L.info(`Bridge withdraw centralized token ${this.tokenId} params`, {
        burningTxId,
        userFeeSelection,
        userFeeLevel,
        tempAddress,
        privacyFee,
        nativeFee,
      });
      new Validator('privacyFee', privacyFee).amount();
      new Validator('nativeFee', nativeFee).amount();
      new Validator('tempAddress', tempAddress).required().string();
      new Validator('userFeeSelection', userFeeSelection).required().number();
      new Validator('userFeeLevel', userFeeLevel).required().number();
      new Validator('burningTxId', burningTxId).required().string();
      new Validator('signPublicKey', signPublicKey).string();
      const result = await centralizedWithdraw({
        privacyFee,
        nativeFee,
        address: tempAddress,
        userFeeSelection,
        userFeeLevel,
        incognitoTxToPayOutsideChainFee: burningTxId,
        signPublicKey,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bridgeWithdrawDecentralized({
    incognitoAmount,
    requestedAmount,
    paymentAddress,
    burningTxId,
    userFeeId,
    userFeeSelection,
    userFeeLevel,
    signPublicKey,
  }: {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    burningTxId: string;
    userFeeId: string;
    userFeeSelection: number;
    userFeeLevel: number;
    signPublicKey?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('incognitoAmount', incognitoAmount).required().amount();
      new Validator('requestedAmount', requestedAmount).required().string();
      new Validator('paymentAddress', paymentAddress).required().string();
      new Validator('incognitoTx', burningTxId).required().string();
      new Validator('id', userFeeId).required().number();
      new Validator('userFeeSelection', userFeeSelection).required().number();
      new Validator('userFeeLevel', userFeeLevel).required().number();
      new Validator('signPublicKey', signPublicKey).string();
      const { currencyType, contractID } = this.bridgeInfo;
      const tokenId = this.tokenId;
      const walletAddress = this.accountKeySet.paymentAddressKeySerialized;
      const result = await decentralizedWithdraw({
        incognitoAmount,
        requestedAmount,
        paymentAddress,
        walletAddress,
        tokenId,
        incognitoTx: burningTxId,
        currencyType,
        erc20TokenAddress: contractID,
        id: userFeeId,
        userFeeSelection,
        userFeeLevel,
        signPublicKey,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bridgeWithdrawCheckValAddress({ address }: { address: string }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      new Validator('address', address).required().string();
      return checkValidAddress({
        address,
        currencyType: this.bridgeInfo.currencyType,
      });
    } catch (error) {
      throw error;
    }
  }

  async bridgeGetMinMaxWithdraw() {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support deposit function`
        );
      }
      const minMaxTokens = await getMinMaxDepositAmount();
      const findMinMaxToken = minMaxTokens.find(
        (token: IMinMaxToken) => token?.TokenID === this.tokenId
      );
      let payload;
      if (findMinMaxToken) {
        payload = {
          minAmount: findMinMaxToken?.MinAmount,
          maxAmount: findMinMaxToken?.MaxAmount,
        };
      }
      return payload;
    } catch (error) {
      throw error;
    }
  }
}

export default PrivacyToken;
