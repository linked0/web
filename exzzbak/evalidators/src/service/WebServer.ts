/**
 *  The web server of the validator information server
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import bodyParser from "body-parser";
import cors from "cors";
import { IScheduler } from "../modules/scheduler/Scheduler";
import { WebService } from "../modules/service/WebService";
import { ValidatorStorage } from "../modules/storage/ValidatorStorage";
import { Config } from "./common/Config";
import { cors_options } from "./option/cors";
import { Router } from "./routers/Router";

export class WebServer extends WebService {
    /**
     * The collection of schedulers
     * @protected
     */
    protected schedules: IScheduler[] = [];

    /**
     * The configuration of the database
     * @private
     */
    private readonly _config: Config;

    /**
     * The router of the BOA Bridge
     * @public
     */
    public readonly _router: Router;

    /**
     *
     * @private
     */
    private readonly _storage: ValidatorStorage;

    public get storage(): ValidatorStorage {
        return this._storage;
    }

    /**
     * Constructor
     * @param config Configuration
     * @param schedules Array of IScheduler
     */
    constructor(config: Config, schedules?: IScheduler[]) {
        super(config.server.port, config.server.address);

        this._config = config;
        this._storage = new ValidatorStorage(config.database);
        this._router = new Router(this, this._config, this._storage);

        if (schedules) {
            schedules.forEach((m) => this.schedules.push(m));
            this.schedules.forEach((m) =>
                m.setOption({
                    config: this._config,
                    router: this._router,
                    storage: this._storage,
                })
            );
        }
    }

    /**
     * Setup and start the server
     */
    public async start(): Promise<void> {
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
        // parse application/json
        this.app.use(bodyParser.json({ limit: "1mb" }));
        this.app.use(cors(cors_options));

        await this._storage.createTables();

        this._router.registerRoutes();

        this.schedules.forEach((m) => m.start());

        return super.start();
    }

    public stop(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            for (const m of this.schedules) m.stop();
            for (const m of this.schedules) await m.waitForStop();
            if (this._storage != null) {
                await this._storage.close();
            }
            if (this.server != null) {
                this.server.close((err?) => {
                    if (err) reject(err);
                    else resolve();
                });
            } else resolve();
        });
    }
}
