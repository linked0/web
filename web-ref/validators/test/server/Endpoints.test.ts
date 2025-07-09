import * as assert from "assert";
import * as dotenv from "dotenv";
import * as path from "path";
import { URL } from "url";
import { Utils } from "../../src/modules/utils/Utils";
import { Config } from "../../src/service/common/Config";
import { VoterScheduler } from "../../src/service/scheduler/VoterScheduler";
import { BOACoin } from "../../src/service/utils/Amount";
import { AgoraDepositContract } from "../../typechain-types";
import { delay, TestClient, TestWebServer } from "../Utility";

import * as hre from "hardhat";

import fs from "fs";

// tslint:disable-next-line:no-var-requires
const URI = require("urijs");

dotenv.config({ path: "env/.env" });

const TX_VALUE = BOACoin.make(40_000).value;

describe("Test of Web Server", function () {
    this.timeout(1000 * 60);

    const client = new TestClient();
    let web_server: TestWebServer;
    let serverURL: URL;
    const config = new Config();

    before("Create TestWebServer", async () => {
        config.readFromFile(path.resolve(process.cwd(), "config/config_test.yaml"));
        console.log("config: ", config);
        serverURL = new URL(`http://127.0.0.1:${config.server.port}`);
        web_server = new TestWebServer(config, [new VoterScheduler(1)]);
    });

    before("Start TestWebServer", async () => {
        await web_server.start();
    });

    before("Deploy deposit contract", async () => {
        await VoterScheduler.deployDepositContract(config);
    });

    let depositContract: AgoraDepositContract;
    const provider = hre.waffle.provider;
    const [admin] = provider.getWallets();
    const admin_signer = provider.getSigner(admin.address);

    before("Deposit", async () => {
        const ContractFactory = await hre.ethers.getContractFactory("AgoraDepositContract");
        depositContract = ContractFactory.attach(config.voter.deposit_contract_address) as AgoraDepositContract;
        const deposit_data = JSON.parse(fs.readFileSync("./test/server/deposit_data.json", "utf-8"));
        for (const elem of deposit_data) {
            await depositContract
                .connect(admin_signer)
                .deposit_with_voter(
                    Utils.prefix0X(elem.pubkey),
                    Utils.prefix0X(elem.withdrawal_credentials),
                    Utils.prefix0X(elem.signature),
                    Utils.prefix0X(elem.deposit_data_root),
                    {
                        voter: Utils.prefix0X(elem.voter.substring(24)),
                        signature: Utils.prefix0X(elem.voter_signature),
                        data_root: Utils.prefix0X(elem.voter_data_root),
                    },
                    { from: admin.address, value: TX_VALUE }
                );
        }
    });

    after("Stop TestWebServer", async () => {
        await web_server.dropTable();
        await web_server.stop();
    });

    context("Test of endpoint", () => {
        it("Prepare", async () => {
            await web_server.createTable();
            await web_server.insertTestData();
        });

        it("Wait", async () => {
            await delay(3000);
        });

        it("Test of the path /validators", async () => {
            const url = URI(serverURL).directory("validators").toString();
            console.log(url);
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 200);
            assert.strictEqual(response.data.data.validators.length, 64);
            assert.strictEqual(response.data.data.header.page_size, 100);
            assert.strictEqual(response.data.data.header.page_index, 1);
            assert.strictEqual(response.data.data.header.total_page, 1);
        });

        it("Test of the path /validators with `page` params", async () => {
            const url = URI(serverURL)
                .directory("validators")
                .addQuery("page_index", 2)
                .addQuery("page_size", 10)
                .toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 200);
            assert.strictEqual(response.data.data.validators.length, 10);
            assert.strictEqual(response.data.data.header.page_size, 10);
            assert.strictEqual(response.data.data.header.page_index, 2);
            assert.strictEqual(response.data.data.header.total_page, 7);
        });

        it("Test of the path /validators with wrong page_index", async () => {
            const url = URI(serverURL)
                .directory("validators")
                .addQuery("page_index", -1)
                .addQuery("page_size", 10)
                .toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 400);
        });

        it("Test of the path /validators with wrong page_size", async () => {
            const url = URI(serverURL)
                .directory("validators")
                .addQuery("page_index", 2)
                .addQuery("page_size", -1)
                .toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 400);
        });

        it("Test of the path /validator/:address - Not exist", async () => {
            const address = "0x0000000000000000000000000000000000000000";
            const url = URI(serverURL).directory("validator").filename(address).toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 404);
        });

        it("Test of the path /validator/:address", async () => {
            const address = "0xA27580552dbC65929E2C77f2AC4bFDD1910673ee";
            const url = URI(serverURL).directory("validator").filename(address).toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 200);
            assert.strictEqual(response.data.data.validatorindex, 0);
            assert.strictEqual(
                response.data.data.pubkey,
                "0x987a46c50f8a23260badf21e4e9fd8d28b1b659d8dcd25e2eb236fd2ec04e8c2fa222a5925a300f699eda68c3d389837"
            );
            assert.strictEqual(response.data.data.address.toLowerCase(), address.toLowerCase());
        });

        it("Slash", async () => {
            await web_server.storage.pool.query(
                "update validators set slashed = true  where pubkeyhex = '987a46c50f8a23260badf21e4e9fd8d28b1b659d8dcd25e2eb236fd2ec04e8c2fa222a5925a300f699eda68c3d389837';"
            );
        });

        it("Wait", async () => {
            await delay(5000);
        });

        it("Test of the path /validator/:address - Not exist", async () => {
            const address = "0xA27580552dbC65929E2C77f2AC4bFDD1910673ee";
            const url = URI(serverURL).directory("validator").filename(address).toString();
            const response = await client.get(url);
            assert.strictEqual(response.data.status, 404);
        });
    });
});
