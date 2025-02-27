/**
 *  The router of the validator information server
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { WebService } from "../../modules/service/WebService";
import { ValidatorStorage } from "../../modules/storage/ValidatorStorage";
import { Utils } from "../../modules/utils/Utils";
import { Config } from "../common/Config";
import { logger } from "../common/Logger";

import express from "express";

// tslint:disable-next-line:no-var-requires
const { body, param, query, validationResult } = require("express-validator");

export interface IValidatorsHeader {
    page_size: number;
    page_index: number;
    total_page: number;
}

export interface IValidatorInfo {
    validatorindex: number;
    pubkey: string;
    address: string;
}

export interface IValidatorsResult {
    header: IValidatorsHeader;
    validators: IValidatorInfo[];
}

export class Router {
    /**
     *
     * @private
     */
    private _web_service: WebService;

    /**
     * The configuration of the database
     * @private
     */
    private readonly _config: Config;

    /**
     *
     * @private
     */
    private _storage: ValidatorStorage;

    /**
     *
     * @param service  WebService
     * @param config Configuration
     */
    constructor(service: WebService, config: Config, storage: ValidatorStorage) {
        this._web_service = service;
        this._config = config;
        this._storage = storage;
    }

    private get app(): express.Application {
        return this._web_service.app;
    }

    /**
     * Make the response storage
     * @param status    The result code
     * @param data      The result storage
     * @param error     The error
     * @private
     */
    private static makeResponseData(status: number, data: any, error?: any): any {
        return {
            status,
            data,
            error,
        };
    }

    public registerRoutes() {
        this.app.get("/", [], this.getDummy.bind(this));
        this.app.get("/validators", [], this.getValidators.bind(this));
        this.app.get(
            "/validator/:address",
            [param("address").exists().isEthereumAddress()],
            this.getValidator.bind(this)
        );
    }

    private async getDummy(req: express.Request, res: express.Response) {
        return res.json(Router.makeResponseData(200, "OK"));
    }

    /**
     * GET /validators
     *
     * Return the information of validators stored in the block explorer
     * @private
     */
    private async getValidators(req: express.Request, res: express.Response) {
        logger.http("Get /validators/");

        let page_index: number;
        let page_size: number;
        if (req.query.page_index !== undefined && Number(req.query.page_index) !== 0) {
            if (!Utils.isPositiveInteger(req.query.page_index.toString())) {
                return res.json(
                    Router.makeResponseData(400, undefined, {
                        message: `Invalid value for parameter 'page_index': ${req.query.page_index.toString()}`,
                    })
                );
            }
            page_index = Number(req.query.page_index.toString());
        } else {
            page_index = 1;
        }

        if (req.query.page_size !== undefined) {
            if (!Utils.isPositiveInteger(req.query.page_size.toString())) {
                return res.json(
                    Router.makeResponseData(400, undefined, {
                        message: `Invalid value for parameter 'page_size': ${req.query.page_size.toString()}`,
                    })
                );
            }
            page_size = Number(req.query.page_size.toString());
        } else {
            page_size = 100;
        }

        try {
            // Get validators in the page
            const data = await this._storage.getValidators(page_size, page_index);

            // Make header with calculating the total page
            let full_count = 0;
            if (data.rows.length === 0) {
                if (page_index > 1) {
                    const data_second = await this._storage.getValidators(page_size, 1);
                    full_count = data_second.rows.length > 0 ? data_second.rows[0].full_count : 0;
                }
            } else {
                full_count = data.rows[0].full_count;
            }
            const total_page = full_count === 0 ? 0 : Math.floor((full_count - 1) / page_size) + 1;
            console.log("full_count: ", full_count, ", Total page: ", total_page);
            const header: IValidatorsHeader = {
                page_size,
                page_index,
                total_page,
            };

            // Make validators result with returned data from the storage
            const validators: IValidatorInfo[] = data.rows.map((m) => {
                return {
                    validatorindex: m.validatorindex,
                    pubkey: Utils.prefix0X(m.pubkeyhex),
                    address: Utils.prefix0X(m.votekeyhex),
                };
            });

            // Make result data
            const result: IValidatorsResult = {
                header,
                validators,
            };
            return res.json(Router.makeResponseData(200, result));
        } catch {
            return res.json(
                Router.makeResponseData(500, undefined, {
                    message: "Failed to read data.",
                })
            );
        }
    }

    /**
     * GET /validator
     *
     * Return the information of a validator matched with the public key string
     * @private
     */
    private async getValidator(req: express.Request, res: express.Response) {
        logger.http(`GET /validator/:address`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(
                Router.makeResponseData(400, undefined, {
                    validation: errors.array(),
                    message: "Failed to check the validity of parameters.",
                })
            );
        }

        try {
            const address = req.params.address;
            const data = await this._storage.getValidator(address);
            if (data.rows.length > 0) {
                const validator: IValidatorInfo = {
                    validatorindex: data.rows[0].validatorindex,
                    pubkey: Utils.prefix0X(data.rows[0].pubkeyhex),
                    address: Utils.prefix0X(data.rows[0].votekeyhex),
                };
                return res.json(Router.makeResponseData(200, validator));
            } else {
                return res.json(
                    Router.makeResponseData(404, undefined, {
                        message: "Failed to find a validator.",
                    })
                );
            }
        } catch {
            return res.json(
                Router.makeResponseData(500, undefined, {
                    message: "Failed to read data.",
                })
            );
        }
    }
}
