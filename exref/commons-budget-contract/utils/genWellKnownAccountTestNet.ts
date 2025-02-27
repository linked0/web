import * as fs from "fs";
import * as hre from "hardhat";
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';
import { join } from "path";

import { NonceManager } from "@ethersproject/experimental";
import {Account} from "web3-core";

export interface IValidatorInfo {
    index: number;
    privateKey: string;
    address: string;
}

async function main() {
    const folderPrefix = "validator_keys";
    let validators: IValidatorInfo[] = [];
    let index: number = 0;
    let envInfo: string = "";
    let hardhatInfo: string = "";
    const valPrefix = "VALIDATOR_KEY_";

    for (let i = 1; i < 100; i++) {
        const folderName = folderPrefix + i.toString();
        const folderPath = join(process.env.VALIDATORS_KEY_PATH, folderName);

        if (!fs.existsSync(folderPath)) {
            break;
        }

        // searching key folders like validator_keys1, validator_keys2, ...
        fs.readdirSync(folderPath).forEach(file => {
            if (!file.startsWith("voter-keystore-")) {
                return;
            }

            const data = JSON.parse(fs.readFileSync(join(folderPath, file)), "utf-8");
            let account: Account;
            try {
                account = hre.web3.eth.accounts.decrypt(data, process.env.KEYSTORE_PASSWORD);
                const validator: IValidatorInfo = {
                    index: index,
                    privateKey: account.privateKey,
                    address: account.address,
                };
                validators.push(validator);
                envInfo += valPrefix + index.toString() + "=" + account.privateKey + "\n";
                hardhatInfo += ", process.env." + valPrefix + index.toString() + " || \"\"";
                index++;
            } catch (e) {
                console.log("Exception occured in decrypting", join(folderPath, file));
            }
        });
    }
    console.log("Total count of validators decrypted: ", validators.length);
    writeFileSync(join(".", "WellknownAccount.ts"), JSON.stringify(validators), {
        flag: "w",
    });
    writeFileSync(join(".", "WellknownAccountEnv.info"), envInfo, {
        flag: "w",
    });
    writeFileSync(join(".", "WellknownAccountHardhat.info"), hardhatInfo, {
        flag: "w",
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.e
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
