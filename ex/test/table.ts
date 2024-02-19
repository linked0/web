import { ethers } from "hardhat";
import { PLib } from "../typechain-types";
import { table } from "console";

describe("Table", function () {
    before(async function () {
        
    });
    it("Should return the new greeting once it's changed", async function () {
        // print ["a", 1] with table format
        const a = {"name": "a", value: 1};
        const b = {"name": "b", value: 2}
        console.table([a, b]);
    });
});