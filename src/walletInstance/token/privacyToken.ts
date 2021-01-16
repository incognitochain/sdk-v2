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
  }: {
    paymentInfoList: PaymentInfoModel[];
    nativeFee?: string;
    privacyFee?: string;
    memo?: string;
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
  async bridgeGenerateDepositAddress() {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support deposit function`
        );
      }
      L.info('Create deposit request', {
        tokenId: this.tokenId,
        currencyType: this.bridgeInfo.currencyType,
        paymentAddress: this.accountKeySet.paymentAddressKeySerialized,
      });
      let task: any[] = [getMinMaxDepositAmount()];
      const commonParams = {
        paymentAddress: this.accountKeySet.paymentAddressKeySerialized,
        walletAddress: this.accountKeySet.paymentAddressKeySerialized,
        tokenId: this.tokenId,
        currencyType: this.bridgeInfo.currencyType,
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
  async bridgeGetHistory() {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      const payload = {
        WalletAddress: this.accountKeySet.paymentAddressKeySerialized,
        PrivacyTokenAddress: this.tokenId,
      };
      const { WalletAddress, PrivacyTokenAddress } = payload;
      new Validator('walletAddress', WalletAddress).required().string();
      new Validator('tokenId', PrivacyTokenAddress).required().string();
      const histories = await getBridgeHistory(payload);
      L.info('Get bridge history successfully');
      return histories;
    } catch (e) {
      L.error('Get bridge history failed', e);
      throw e;
    }
  }

  async bridgeRetryHistory({
    id,
    decentralized,
    walletAddress,
    addressType,
    currencyType,
    userPaymentAddress,
    privacyTokenAddress,
    erc20TokenAddress,
    outChainTx,
  }: {
    id: number;
    decentralized: number;
    walletAddress: string;
    addressType: number;
    currencyType: number;
    userPaymentAddress: string;
    privacyTokenAddress: string;
    erc20TokenAddress: string;
    outChainTx: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      const payload = {
        ID: id,
        Decentralized: decentralized,
        WalletAddress: walletAddress,
        AddressType: addressType,
        CurrencyType: currencyType,
        PaymentAddress: userPaymentAddress,
        PrivacyTokenAddress: privacyTokenAddress,
        Erc20TokenAddress: erc20TokenAddress,
        TxOutchain: outChainTx,
      };
      new Validator('id', id).required().number();
      new Validator('decentralized', decentralized).required().number();
      new Validator('walletAddress', walletAddress).required().string();
      new Validator('addressType', addressType).required().number();
      new Validator('currencyType', currencyType).required().number();
      new Validator('userPaymentAddress', userPaymentAddress)
        .required()
        .string();
      new Validator('privacyTokenAddress', privacyTokenAddress)
        .required()
        .string();
      new Validator('erc20TokenAddress', erc20TokenAddress).string();
      new Validator('outChainTx', outChainTx).string();
      return await retryBridgeHistory(payload);
    } catch (e) {
      throw e;
    }
  }

  async bridgeRemoveHistory({
    id,
    currencyType,
    decentralized,
  }: {
    id: number;
    currencyType: number;
    decentralized: number;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
      const payload = {
        ID: id,
        CurrencyType: currencyType,
        Decentralized: decentralized,
      };
      new Validator('id', id).required().number();
      new Validator('decentralized', decentralized).required().number();
      new Validator('currencyType', currencyType).required().number();
      return await removeBridgeHistory(payload);
    } catch (e) {
      throw e;
    }
  }

  // bridge withdraw

  async bridgeWithdrawEstUserFee({
    requestedAmount,
    incognitoAmount,
    paymentAddress,
    memo,
  }: {
    requestedAmount: string;
    incognitoAmount: string;
    paymentAddress: string;
    memo?: string;
  }) {
    try {
      if (!this.bridgeInfo) {
        throw new Error(
          `Token ${this.tokenId} does not support bridge history function`
        );
      }
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
  }: {
    outchainAddress: string;
    burningAmount: string;
    nativeFee: string;
    privacyFee: string;
    privacyPaymentInfoList: PaymentInfoModel[];
    nativePaymentInfoList?: PaymentInfoModel[];
    memo?: string;
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
    tokenFee,
  }: {
    burningTxId: string;
    userFeeSelection: number;
    userFeeLevel: number;
    tempAddress: string;
    privacyFee?: string;
    tokenFee?: string;
  }) {
    try {
      L.info(`Bridge withdraw centralized token ${this.tokenId} params`, {
        burningTxId,
        userFeeSelection,
        userFeeLevel,
        tempAddress,
        privacyFee,
        tokenFee,
      });
      const result = await centralizedWithdraw({
        privacyFee,
        tokenFee,
        address: tempAddress,
        userFeeSelection,
        userFeeLevel,
        incognitoTxToPayOutsideChainFee: burningTxId,
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
  }: {
    incognitoAmount: string;
    requestedAmount: string;
    paymentAddress: string;
    burningTxId: string;
    userFeeId: string;
    userFeeSelection: number;
    userFeeLevel: number;
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
      const { currencyType, contractID } = this.bridgeInfo;
      const tokenId = this.tokenId;
      const walletAddress = this.accountKeySet.paymentAddressKeySerialized;
      L.info(`Bridge withdraw decentralized token ${this.tokenId} params`, {
        incognitoAmount,
        requestedAmount,
        paymentAddress,
        burningTxId,
        userFeeId,
        userFeeSelection,
        userFeeLevel,
      });
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
      return checkValidAddress({
        address,
        currencyType: this.bridgeInfo.currencyType,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default PrivacyToken;
