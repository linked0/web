/**
 *  Main of the validator information server
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import * as dotenv from "dotenv";
import { IScheduler } from "./modules/scheduler/Scheduler";
import { Config } from "./service/common/Config";
import { logger, Logger } from "./service/common/Logger";
import { VoterScheduler } from "./service/scheduler/VoterScheduler";
import { WebServer } from "./service/WebServer";

dotenv.config({ path: "env/.env" });

async function main() {
    // Create with the arguments and read from file
    const config = Config.createWithArgument();

    // Now configure the logger with the expected transports
    switch (process.env.NODE_ENV) {
        case "test":
            // Logger is silent, do nothing
            break;

        case "development":
            // Only use the console log
            logger.add(Logger.defaultConsoleTransport());
            break;

        case "production":
        default:
            // Read the config file and potentially use both
            logger.add(Logger.defaultFileTransport(config.logging.folder));
            if (config.logging.console) logger.add(Logger.defaultConsoleTransport());
    }
    logger.transports.forEach((tp) => {
        tp.level = config.logging.level;
    });

    logger.info(`address: ${config.server.address}`);
    logger.info(`port: ${config.server.port}`);

    const schedulers: IScheduler[] = [];
    if (config.scheduler.enable) {
        const scheduler = config.scheduler.getScheduler("voter");
        if (scheduler && scheduler.enable) {
            await VoterScheduler.deployDepositContract(config);
            schedulers.push(new VoterScheduler(scheduler.interval));
        }
    }

    let server: WebServer;
    server = new WebServer(config, schedulers);
    server.start().catch((error: any) => {
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                logger.error(`${config.server.port} requires elevated privileges`);
                break;
            case "EADDRINUSE":
                logger.error(`Port ${config.server.port} is already in use`);
                break;
            default:
                logger.error(`An error occurred while starting the server: ${error.stack}`);
        }
        process.exit(1);
    });

    process.on("SIGINT", () => {
        server.stop().then(() => {
            process.exit(0);
        });
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
