import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import { BigNumber, BigNumberish } from "ethers";
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
describe(`Sending fees through PayableProxy`, function () {
    const { provider } = waffle;

    const [admin, owner, operator, feeAdmin, user] = provider.getWallets();
    const adminSigner = provider.getSigner(admin.address);
    const ownerSigner = provider.getSigner(owner.address);
    const operatorSigner = provider.getSigner(operator.address);
    const userSigner = provider.getSigner(user.address);

    let wboaContract: WETH;
    let feeCollectorContract: BoaFeeCollector;
    let beaconContract: UpgradeBeacon;
    let proxyContract: PayableProxy;

    before(async () => {
        console.log("admin:", admin.address);
        console.log("owner:", owner.address);
        console.log("user:", user.address);

        // deploy WBOA contract
        const wboaFactory = await ethers.getContractFactory("WETH");
        wboaContract = (await wboaFactory.connect(admin).deploy()) as WETH;
        await wboaContract.deployed();
        console.log("WETH:", wboaContract.address);

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

        // initialize the UpgradeBeacon contract
        await beaconContract.connect(admin).initialize(owner.address, feeCollectorContract.address);

        // initialize the PayableProxy
        await proxyContract.connect(admin).initialize(owner.address);

        // add wallet to withdraw the accumulated fees
        const encodedData = feeCollectorContract.interface.encodeFunctionData("addWithdrawAddress", [feeAdmin.address]);
        await ownerSigner.sendTransaction({
            to: proxyContract.address,
            data: encodedData,
        });
    });

    this.beforeEach(async () => {});

    it("Withdraw native tokens from the fee collector", async () => {
        const amount = ethers.utils.parseEther("100");

        // send native tokens to the fee collector throuhg proxyContract
        await userSigner.sendTransaction({
            to: proxyContract.address,
            value: amount,
        });
        expect(await provider.getBalance(proxyContract.address)).equals(amount);
    });

    it("Withdraw WBOA tokens from the fee collector", async () => {
        const amount = ethers.utils.parseEther("100");
        const prevBalance = await provider.getBalance(feeAdmin.address);

        console.log("owner of fee collector:", await feeCollectorContract.owner());

        // deposit from user to WBOA
        await wboaContract.connect(user).deposit({ value: amount });

        // send native tokens to the fee collector throuhg proxyContract
        await wboaContract.connect(user).transferFrom(user.address, proxyContract.address, amount);

        // withdraw fees to the fee admin
        const encodedData = feeCollectorContract.interface.encodeFunctionData("unwrapAndWithdraw", [
            feeAdmin.address.toString(),
            wboaContract.address,
            amount,
        ]);
        await ownerSigner.sendTransaction({
            to: proxyContract.address,
            data: encodedData,
        });

        expect(await provider.getBalance(feeAdmin.address)).to.be.equal(prevBalance.add(amount));
    });

    it("Withdraw WBOA tokens with an operator not registered", async () => {
        const amount = ethers.utils.parseEther("100");
        const prevBalance = await provider.getBalance(feeAdmin.address);

        // deposit from user to WBOA
        await wboaContract.connect(user).deposit({ value: amount });

        // send native tokens to the fee collector throuhh proxyContract
        await wboaContract.connect(user).transferFrom(user.address, proxyContract.address, amount);

        // try to withdraw fees to the fee admin
        const encodedData = feeCollectorContract.interface.encodeFunctionData("unwrapAndWithdraw", [
            feeAdmin.address.toString(),
            wboaContract.address,
            amount,
        ]);
        await expect(
            operatorSigner.sendTransaction({
                to: proxyContract.address,
                data: encodedData,
            })
        ).to.be.revertedWith("InvalidOperator");
    });
});
