import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import { faucet } from "../utils/faucet";
import type {
    WETH__factory as WETHFactory,
    WETH,
    BoaFeeCollector__factory as BoaFeeCollectorFactory,
    BoaFeeCollector,
    UpgradeBeacon__factory as UngradeBeaconFactory,
    UpgradeBeacon,
    PayableProxy__factory as PayableProxyFactory,
    PayableProxy,
    TwoStepOwnable__factory as TwoStepOwnableFactory,
    TwoStepOwnable,
} from "../../typechain-types";

const { parseEther } = ethers.utils;

/**
 * Transfer fees through PayableProxy
 */
describe(`Initialize PayableProxy, UpgradeBeacon, BoaFeeCollector`, function () {
    const { provider } = waffle;

    const [admin, owner, operator] = provider.getWallets();
    const adminSigner = provider.getSigner(admin.address);
    const ownerSigner = provider.getSigner(owner.address);

    let twoStepContract: TwoStepOwnable;
    let wboaContract: WETH;
    let feeCollectorContract: BoaFeeCollector;
    let beaconContract: UpgradeBeacon;
    let proxyContract: PayableProxy;

    before(async () => {
        await faucet(admin.address, provider);
        await faucet(owner.address, provider);

        console.log("admin:", admin.address);
        console.log("owner:", owner.address);

        console.log("admin balance: ", await provider.getBalance(admin.address));
        console.log("owner balance: ", await provider.getBalance(owner.address));

        // deploy WBOA contract
        const wboaFactory = await ethers.getContractFactory("WETH");
        wboaContract = (await wboaFactory.connect(admin).deploy()) as WETH;
        await wboaContract.deployed();
        console.log("WETH:", wboaContract.address);
    });

    this.beforeEach(async () => {
        // deploy BoaFeeCollector contract
        const feeCollectorFactory = await ethers.getContractFactory("BoaFeeCollector");
        feeCollectorContract = (await feeCollectorFactory.connect(admin).deploy()) as BoaFeeCollector;
        await feeCollectorContract.deployed();
        console.log("BoaFeeCollector:", feeCollectorContract.address);

        // deploy UpgradeBeacon contract
        const beaconFactory = await ethers.getContractFactory("UpgradeBeacon");
        beaconContract = (await beaconFactory.connect(admin).deploy()) as UpgradeBeacon;
        await beaconContract.deployed();
        console.log("UpgradeBeacon:", beaconContract.address);

        // deploy PayableProxy contract
        const proxyFactory = await ethers.getContractFactory("PayableProxy");
        proxyContract = (await proxyFactory.connect(admin).deploy(beaconContract.address)) as PayableProxy;
        await proxyContract.deployed();
        console.log("PayableProxy:", proxyContract.address);
    });

    it("Initialize the UpgradeBeacon and check the owner", async () => {
        // initialize the UpgradeBeacon contract
        await beaconContract.connect(admin).initialize(owner.address, feeCollectorContract.address);

        expect(await beaconContract.owner()).to.equal(owner.address);
        expect(await beaconContract.implementation()).to.equal(feeCollectorContract.address);

        // trying to initialize again with admin account
        await expect(
            beaconContract.connect(admin).initialize(admin.address, feeCollectorContract.address)
        ).to.be.revertedWith(
            "Initialize must originate from an approved deployer, and the implementation must not be set."
        );

        // trying to upgrade to new implementation with admin account
        await expect(beaconContract.connect(admin).upgradeTo(feeCollectorContract.address)).to.be.revertedWith(
            "CallerIsNotOwner"
        );

        // trying to upgrade to new implementation with owner account
        await expect(beaconContract.connect(owner).upgradeTo(feeCollectorContract.address));
    });

    it("Initialize BoaFeeCollector and check owner", async () => {
        // initialize the BoaFeeCollector contract
        await feeCollectorContract.connect(admin).initialize(owner.address);

        expect(await feeCollectorContract.owner()).to.equal(owner.address);

        // try to assign operator with admin account
        await expect(feeCollectorContract.connect(admin).assignOperator(operator.address)).to.be.revertedWith(
            "CallerIsNotOwner"
        );

        // assign operator with owner account
        await expect(feeCollectorContract.connect(owner).assignOperator(operator.address));
    });

    it("Initialize contracts through PayableProxy and assingn operator", async () => {
        // initialize the UpgradeBeacon contract
        await beaconContract.connect(admin).initialize(owner.address, feeCollectorContract.address);

        // initialize the PayableProxy
        await proxyContract.connect(admin).initialize(owner.address);

        // FAIL: try to assign operator with admin account
        await expect(feeCollectorContract.connect(admin).assignOperator(operator.address)).to.be.revertedWith(
            "CallerIsNotOwner"
        );

        // FAIL: try to assign operator with owner account
        await expect(feeCollectorContract.connect(owner).assignOperator(operator.address)).to.be.revertedWith(
            "CallerIsNotOwner"
        );

        // assign operator with owner account through PayableProxy
        const encodedData = feeCollectorContract.interface.encodeFunctionData("assignOperator", [operator.address]);
        await ownerSigner.sendTransaction({
            to: proxyContract.address,
            data: encodedData,
        });
    });
});
