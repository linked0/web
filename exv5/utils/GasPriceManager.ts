"use strict";

import "@nomiclabs/hardhat-web3";
import { BigNumber, ethers } from "ethers";

export class GasPriceManager extends ethers.Signer {
  readonly signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    super();
    this.signer = signer;
    ethers.utils.defineReadOnly(this, "signer", signer);
    // @ts-ignore
    ethers.utils.defineReadOnly(this, "provider", signer.provider || null);
  }

  connect(provider: ethers.providers.Provider): GasPriceManager {
    return new GasPriceManager(this.signer.connect(provider));
  }

  getAddress(): Promise<string> {
    return this.signer.getAddress();
  }

  getTransactionCount(blockTag?: ethers.providers.BlockTag): Promise<number> {
    return this.signer.getTransactionCount(blockTag);
  }

  signMessage(message: ethers.Bytes | string): Promise<string> {
    return this.signer.signMessage(message);
  }

  signTransaction(
    transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
  ): Promise<string> {
    return this.signer.signTransaction(transaction);
  }

  sendTransaction(
    transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
  ): Promise<ethers.providers.TransactionResponse> {
    const provider = this.signer.provider;
    if (provider === undefined) {
      const maxPriorityFeePerGas = 1500000000;
      const maxFeePerGas = maxPriorityFeePerGas;

      transaction.maxPriorityFeePerGas = BigNumber.from(maxPriorityFeePerGas);
      transaction.maxFeePerGas = BigNumber.from(maxFeePerGas);
      return this.signer.sendTransaction(transaction).then((tx) => {
        return tx;
      });
    }
    return provider.getBlock("latest").then((block) => {
      const baseFeePerGas =
        block.baseFeePerGas != null ? block.baseFeePerGas.toNumber() : 0;
      const maxPriorityFeePerGas = 1500000000;
      const maxFeePerGas =
        Math.floor(baseFeePerGas * 1.265625) + maxPriorityFeePerGas;

      transaction.maxPriorityFeePerGas = BigNumber.from(maxPriorityFeePerGas);
      transaction.maxFeePerGas = BigNumber.from(maxFeePerGas);
      return this.signer.sendTransaction(transaction).then((tx) => {
        return tx;
      });
    });
  }
}
