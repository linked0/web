/**
 *  The superclass for web service
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import express from "express";
import http from "http";

export class WebService {
    /**
     * The application of express module
     */
    public app: express.Application;
    /**
     * The Http server
     */
    public server: http.Server | null = null;
    /**
     * The bind address
     */
    private readonly address: string;
    /**
     * The bind port
     */
    private readonly port: number;

    /**
     * Constructor
     * @param port The bind port
     * @param address The bind address
     */
    constructor(port: number | string, address: string = "") {
        if (typeof port === "string") this.port = parseInt(port, 10);
        else this.port = port;

        this.address = address;

        this.app = express();
    }

    /**
     * Asynchronously start the web server
     */
    public start(): Promise<void> {
        // Listen on provided this.port on this.address.
        return new Promise<void>((resolve, reject) => {
            // Create HTTP server.
            this.app.set("port", this.port);
            this.server = http.createServer(this.app);
            this.server.on("error", reject);
            this.server.listen(this.port, this.address, () => {
                resolve();
            });
        });
    }
}
