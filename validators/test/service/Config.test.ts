import * as dotenv from "dotenv";
import { Config } from "../../src/service/common/Config";

dotenv.config({ path: "env/.env" });
import * as assert from "assert";

describe("Test of Config", () => {
    it("Test parsing the settings of a string", async () => {
        const config: Config = new Config();
        config.readFromFile("./test/service/config.test.yaml");
        assert.strictEqual(config.server.address, "127.0.0.1");
        assert.strictEqual(config.server.port.toString(), "3000");
        assert.strictEqual(config.database.host, "localhost");
        assert.strictEqual(config.database.user, "postgres");
        assert.strictEqual(config.database.database, "db");
        assert.strictEqual(config.database.port.toString(), "5432");
        assert.strictEqual(config.database.password.toString(), "pass");
        assert.strictEqual(config.logging.folder, "/swap/logs");
        assert.strictEqual(config.logging.level, "debug");

        assert.strictEqual(config.scheduler.enable, true);
        assert.strictEqual(config.scheduler.items.length, 1);
        assert.strictEqual(config.scheduler.items[0].name, "voter");
        assert.strictEqual(config.scheduler.items[0].enable, true);
        assert.strictEqual(config.scheduler.items[0].interval, 1);

        assert.strictEqual(config.voter.deposit_contract_address, "0xf1f0AF73A72D392433BE2c2A6596062632efE433");
    });
});
