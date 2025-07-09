/**
 *  The class that reads the validator information from block explorer.
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import MybatisMapper from "mybatis-mapper";
import path from "path";
import * as pg from "pg";
import { IDatabaseConfig } from "../../service/common/Config";
import { Utils } from "../utils/Utils";

export class ValidatorStorage {
    /**
     *  The instance of mysql Connection Pool.
     */
    public pool: pg.Pool;

    /**
     * Constructor
     * @param databaseConfig Valid value is of type IDatabaseConfig,
     */
    constructor(databaseConfig: IDatabaseConfig) {
        this.pool = new pg.Pool({
            user: databaseConfig.user,
            password: databaseConfig.password,
            host: databaseConfig.host,
            port: databaseConfig.port,
            database: databaseConfig.database,
            max: databaseConfig.max,
            connectionTimeoutMillis: databaseConfig.connectionTimeoutMillis,
        });

        MybatisMapper.createMapper([path.resolve(Utils.getInitCWD(), "src/service/storage/mapper/validators.xml")]);
    }

    public async createTables() {
        const sql = `
            CREATE TABLE IF NOT EXISTS voters
            (
                validatorindex integer                  not null primary key,
                pubkeyhex      text    default ''::text not null,
                votekeyhex     text    default ''::text not null
            );
        `;
        await this.pool.query(sql);
    }

    /**
     * Get information of validators from the block explorer
     */
    public getValidators(page_size: number = 100, page_index: number = 1) {
        console.log(`page_index: ${page_index}, page_size: ${page_size}`);
        const mapperParam = {
            page_size,
            offset: page_size * (page_index - 1),
        };
        const sql = MybatisMapper.getStatement("validators", "getValidatorList", mapperParam, {
            language: "sql",
            indent: "  ",
        });
        return this.pool.query(sql);
    }

    /**
     * Get information of the validator for voting addresses
     */
    public getValidator(address: string) {
        const voteAddress = Utils.remove0X(address);
        const sql = MybatisMapper.getStatement(
            "validators",
            "getValidator",
            { voteAddress },
            {
                language: "sql",
                indent: "  ",
            }
        );
        return this.pool.query(sql);
    }

    /**
     * Close the database
     */
    public close(): Promise<void> {
        return this.pool.end();
    }

    /**
     * Get information of all the validators
     */
    public readValidators() {
        const sql = MybatisMapper.getStatement(
            "validators",
            "readValidators",
            {},
            {
                language: "sql",
                indent: "  ",
            }
        );
        return this.pool.query(sql);
    }

    /**
     * Read all voters
     */
    public readAllVoters() {
        const sql = MybatisMapper.getStatement(
            "validators",
            "readAllVoters",
            {},
            {
                language: "sql",
                indent: "  ",
            }
        );
        return this.pool.query(sql);
    }
}
