/**
 * The class of the scheduler working on linking voting keys to public keys
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { Scheduler } from "../../modules/scheduler/Scheduler";
import { ValidatorStorage } from "../../modules/storage/ValidatorStorage";
import { Utils } from "../../modules/utils/Utils";
import { Config } from "../common/Config";
import { logger } from "../common/Logger";
import { GasPriceManager } from "../utils/GasPriceManager";

import * as hre from "hardhat";

import { NonceManager } from "@ethersproject/experimental";
import { AgoraDepositContract } from "../../../typechain-types";

/**
 * The interface to the validator's public key and the address of the voting key
 */
export interface IVoter {
    validatorindex: number;
    pubkeyhex: string;
    votekeyhex: string;
}

/**
 * The class of the scheduler working on linking voting keys to public keys
 */
export class VoterScheduler extends Scheduler {
    /**
     * Instances for accessing databases
     */
    public _storage: ValidatorStorage | undefined;

    /**
     * The configuration
     */
    public _config: Config | undefined;

    /**
     * Timestamp from previous entry
     * @private
     */
    private _old_time_stamp: number = 0;

    /**
     * Timestamp on new entry
     * @private
     */
    private _new_time_stamp: number = 0;

    /**
     * Random value
     * @private
     */
    private readonly _random_offset: number;

    /**
     * The deposit contract
     * @private
     */
    private deposit_contract: AgoraDepositContract | undefined;

    constructor(interval: number = 15) {
        super(interval);
        this._random_offset = Math.floor(Math.random() * 86400);
    }

    private get config(): Config {
        if (this._config !== undefined) return this._config;
        else {
            logger.error("Config is not ready yet.");
            process.exit(1);
        }
    }

    /**
     * Instances for accessing databases
     * @private
     */
    private get storage(): ValidatorStorage {
        if (this._storage !== undefined) return this._storage;
        else {
            logger.error("Storage is not ready yet.");
            process.exit(1);
        }
    }

    public setOption(options: any) {
        if (options) {
            if (options.config && options.config instanceof Config) this._config = options.config;
            if (options.storage && options.storage instanceof ValidatorStorage) this._storage = options.storage;
        }
    }

    /**
     * Perform the task repeatedly.
     * @protected
     */
    protected async work() {
        this._new_time_stamp = Math.floor(new Date().getTime() / 1000) + this._random_offset;
        if (this._old_time_stamp === 0) this._old_time_stamp = this._new_time_stamp;
        try {
            const old_period = Math.floor(this._old_time_stamp / this.interval);
            const new_period = Math.floor(this._new_time_stamp / this.interval);
            if (old_period !== new_period) {
                const voters: IVoter[] = (await this.storage.readAllVoters()).rows;
                const validators: IVoter[] = (await this.storage.readValidators()).rows;

                const removed_validators: IVoter[] = voters.filter(
                    (voter) =>
                        validators.find((validator) => validator.validatorindex === voter.validatorindex) === undefined
                );
                await this.removeVoters(removed_validators);

                if (this.deposit_contract === undefined)
                    this.deposit_contract = (await hre.ethers.getContractFactory("AgoraDepositContract")).attach(
                        this.config.voter.deposit_contract_address
                    ) as AgoraDepositContract;

                const added_validators: IVoter[] = validators.filter((m) => m.votekeyhex == null);
                for (const validator of added_validators)
                    validator.votekeyhex = Utils.remove0X(
                        await this.deposit_contract.voterOf(Utils.prefix0X(validator.pubkeyhex))
                    );
                await this.addVoters(added_validators);
            }
        } catch (error) {
            logger.error("An exception occurred during execution - " + error);
        }

        this._old_time_stamp = this._new_time_stamp;
    }

    /**
     * Remove voters
     */
    public async removeVoters(data: IVoter[]) {
        if (data.length === 0) return;

        const sql = `DELETE FROM voters WHERE validatorindex IN (${data.map((m) => m.validatorindex).join(",")});`;
        await this.storage.pool.query(sql);
    }

    /**
     * Add voters
     */
    public async addVoters(data: IVoter[]) {
        if (data.length === 0) return;

        const pageSize = 100;
        const length = data.length;
        const pageCount = Math.ceil(length / pageSize);
        const insert_sql = "INSERT INTO voters (validatorindex, pubkeyhex, votekeyhex) VALUES \n";
        const update_sql =
            "ON CONFLICT (validatorindex) DO UPDATE SET pubkeyhex = excluded.pubkeyhex, votekeyhex = excluded.votekeyhex;";
        let sql;
        let pos = 0;
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            sql = insert_sql;
            const last = Math.min(pageSize, length);
            for (let itemIndex = 0; itemIndex < last; itemIndex++, pos++) {
                sql += `(${data[pos].validatorindex}, '${data[pos].pubkeyhex}', '${data[pos].votekeyhex}')`;
                sql += itemIndex === last - 1 ? " \n" : ", \n";
            }
            sql += update_sql;
            await this.storage.pool.query(sql);
        }
    }

    /**
     * This function only runs when it is a test.
     * It is a function of deploying deposit smart contracts.
     * @param config
     */
    public static async deployDepositContract(config: Config) {
        // Only test
        if (hre.network.name === "hardhat") {
            const ContractFactory = await hre.ethers.getContractFactory("AgoraDepositContract");

            const provider = hre.ethers.provider;
            const admin = new hre.ethers.Wallet(process.env.ADMIN_KEY || "");
            const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
            const contract = (await ContractFactory.connect(adminSigner).deploy()) as AgoraDepositContract;
            await contract.deployed();

            config.voter.deposit_contract_address = contract.address;

            console.log("deployed to (address) :", contract.address);
        }
    }
}
