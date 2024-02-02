import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

const deployDMSToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log("###### deployer:", deployer)

    await deploy("DMSToken", {
        from: deployer,
        args: ["DMS Token", "DMS"],
    });
};

export default deployDMSToken
deployDMSToken.tags = ["DMSToken"];