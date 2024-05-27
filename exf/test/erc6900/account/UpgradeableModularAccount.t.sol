// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {console} from "forge-std/Test.sol";

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";
import {UserOperation} from "@eth-infinitism/account-abstraction/interfaces/UserOperation.sol";

import {PluginManagerInternals} from "@erc6900/account/PluginManagerInternals.sol";
import {UpgradeableModularAccount} from "@erc6900/account/UpgradeableModularAccount.sol";
import {FunctionReference} from "@erc6900/helpers/FunctionReferenceLib.sol";
import {IPlugin, PluginManifest} from "@erc6900/interfaces/IPlugin.sol";
import {IAccountLoupe} from "@erc6900/interfaces/IAccountLoupe.sol";
import {IPluginManager} from "@erc6900/interfaces/IPluginManager.sol";
import {Call} from "@erc6900/interfaces/IStandardExecutor.sol";
import {SingleOwnerPlugin} from "@erc6900/plugins/owner/SingleOwnerPlugin.sol";
import {TokenReceiverPlugin} from "@erc6900/plugins/TokenReceiverPlugin.sol";

import {Counter} from "../mocks/Counter.sol";
import {MSCAFactoryFixture} from "../mocks/MSCAFactoryFixture.sol";
import {ComprehensivePlugin} from "../mocks/plugins/ComprehensivePlugin.sol";
import {MockPlugin} from "../mocks/MockPlugin.sol";
import {OptimizedTest} from "../utils/OptimizedTest.sol";

contract UpgradeableModularAccountTest is OptimizedTest {
    using ECDSA for bytes32;

    EntryPoint public entryPoint;
    address payable public beneficiary;
    SingleOwnerPlugin public singleOwnerPlugin;
    TokenReceiverPlugin public tokenReceiverPlugin;
    MSCAFactoryFixture public factory;

    address public owner1;
    uint256 public owner1Key;
    UpgradeableModularAccount public account1;

    address public owner2;
    uint256 public owner2Key;
    UpgradeableModularAccount public account2;

    address public ethRecipient;
    Counter public counter;
    PluginManifest public manifest;

    uint256 public constant CALL_GAS_LIMIT = 50000;
    uint256 public constant VERIFICATION_GAS_LIMIT = 1200000;

    event PluginInstalled(
        address indexed plugin,
        bytes32 manifestHash,
        FunctionReference[] dependencies
    );
    event PluginUninstalled(
        address indexed plugin,
        bool indexed callbacksSucceeded
    );
    event ReceivedCall(bytes msgData, uint256 msgValue);

    function setUp() public {
        entryPoint = new EntryPoint();
        (owner1, owner1Key) = makeAddrAndKey("owner1");
        beneficiary = payable(makeAddr("beneficiary"));
        vm.deal(beneficiary, 1 wei);

        singleOwnerPlugin = _deploySingleOwnerPlugin();
        tokenReceiverPlugin = _deployTokenReceiverPlugin();
        factory = new MSCAFactoryFixture(entryPoint, singleOwnerPlugin);

        // Compute counterfactual address
        account1 = UpgradeableModularAccount(
            payable(factory.getAddress(owner1, 0))
        );
        vm.deal(address(account1), 100 ether);

        // Pre-deploy account two for different gas estimates
        (owner2, owner2Key) = makeAddrAndKey("owner2");
        account2 = factory.createAccount(owner2, 0);
        vm.deal(address(account2), 100 ether);

        ethRecipient = makeAddr("ethRecipient");
        vm.deal(ethRecipient, 1 wei);
        counter = new Counter();
        counter.increment(); // amoritze away gas cost of zero->nonzero transition

        vm.deal(address(this), 100 ether);
        entryPoint.depositTo{value: 1 wei}(address(account2));
    }

    function test_deployAccount() public {
        factory.createAccount(owner1, 0);
    }

    function test_basicUserOp() public {
        UserOperation memory userOp = UserOperation({
            sender: address(account1),
            nonce: 0,
            initCode: abi.encodePacked(
                address(factory),
                abi.encodeCall(factory.createAccount, (owner1, 0))
            ),
            callData: abi.encodeCall(
                SingleOwnerPlugin.transferOwnership,
                (owner2)
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 2,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner1Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        entryPoint.handleOps(userOps, beneficiary);
    }

    function test_standardExecuteEthSend() public {
        address payable recipient = payable(makeAddr("recipient"));

        UserOperation memory userOp = UserOperation({
            sender: address(account1),
            nonce: 0,
            initCode: abi.encodePacked(
                address(factory),
                abi.encodeCall(factory.createAccount, (owner1, 0))
            ),
            callData: abi.encodeCall(
                UpgradeableModularAccount.execute,
                (recipient, 1 wei, "")
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 2,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner1Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        entryPoint.handleOps(userOps, beneficiary);

        assertEq(recipient.balance, 1 wei);
    }

    function test_postDeploy_ethSend() public {
        UserOperation memory userOp = UserOperation({
            sender: address(account2),
            nonce: 0,
            initCode: "",
            callData: abi.encodeCall(
                UpgradeableModularAccount.execute,
                (ethRecipient, 1 wei, "")
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner2Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        entryPoint.handleOps(userOps, beneficiary);

        assertEq(ethRecipient.balance, 2 wei);
    }

    function test_debug_upgradeableModularAccount_storageAccesses() public {
        UserOperation memory userOp = UserOperation({
            sender: address(account2),
            nonce: 0,
            initCode: "",
            callData: abi.encodeCall(
                UpgradeableModularAccount.execute,
                (ethRecipient, 1 wei, "")
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner2Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        vm.record();
        entryPoint.handleOps(userOps, beneficiary);
        _printStorageReadsAndWrites(address(account2));
    }

    function test_contractInteraction() public {
        UserOperation memory userOp = UserOperation({
            sender: address(account2),
            nonce: 0,
            initCode: "",
            callData: abi.encodeCall(
                UpgradeableModularAccount.execute,
                (address(counter), 0, abi.encodeCall(counter.increment, ()))
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner2Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        entryPoint.handleOps(userOps, beneficiary);

        assertEq(counter.number(), 2);
    }

    function test_batchExecute() public {
        // Performs both an eth send and a contract interaction with counter
        Call[] memory calls = new Call[](2);
        calls[0] = Call({target: ethRecipient, value: 1 wei, data: ""});
        calls[1] = Call({
            target: address(counter),
            value: 0,
            data: abi.encodeCall(counter.increment, ())
        });

        UserOperation memory userOp = UserOperation({
            sender: address(account2),
            nonce: 0,
            initCode: "",
            callData: abi.encodeCall(
                UpgradeableModularAccount.executeBatch,
                (calls)
            ),
            callGasLimit: CALL_GAS_LIMIT,
            verificationGasLimit: VERIFICATION_GAS_LIMIT,
            preVerificationGas: 0,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            paymasterAndData: "",
            signature: ""
        });

        // Generate signature
        bytes32 userOpHash = entryPoint.getUserOpHash(userOp);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            owner2Key,
            userOpHash.toEthSignedMessageHash()
        );
        userOp.signature = abi.encodePacked(r, s, v);

        UserOperation[] memory userOps = new UserOperation[](1);
        userOps[0] = userOp;

        entryPoint.handleOps(userOps, beneficiary);

        assertEq(counter.number(), 2);
        assertEq(ethRecipient.balance, 2 wei);
    }

    function test_installPlugin() public {
        vm.startPrank(owner2);

        bytes32 manifestHash = keccak256(
            abi.encode(tokenReceiverPlugin.pluginManifest())
        );

        vm.expectEmit(true, true, true, true);
        emit PluginInstalled(
            address(tokenReceiverPlugin),
            manifestHash,
            new FunctionReference[](0)
        );
        IPluginManager(account2).installPlugin({
            plugin: address(tokenReceiverPlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(uint48(1 days)),
            dependencies: new FunctionReference[](0)
        });

        address[] memory plugins = IAccountLoupe(account2)
            .getInstalledPlugins();
        assertEq(plugins.length, 2);
        assertEq(plugins[0], address(singleOwnerPlugin));
        assertEq(plugins[1], address(tokenReceiverPlugin));
    }

    function test_installPlugin_ExecuteFromPlugin_PermittedExecSelectorNotInstalled()
        public
    {
        vm.startPrank(owner2);

        PluginManifest memory m;
        m.permittedExecutionSelectors = new bytes4[](1);
        m.permittedExecutionSelectors[0] = IPlugin.onInstall.selector;

        MockPlugin mockPluginWithBadPermittedExec = new MockPlugin(m);
        bytes32 manifestHash = keccak256(
            abi.encode(mockPluginWithBadPermittedExec.pluginManifest())
        );

        IPluginManager(account2).installPlugin({
            plugin: address(mockPluginWithBadPermittedExec),
            manifestHash: manifestHash,
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });
    }

    function test_installPlugin_invalidManifest() public {
        vm.startPrank(owner2);

        vm.expectRevert(
            abi.encodeWithSelector(
                PluginManagerInternals.InvalidPluginManifest.selector
            )
        );
        IPluginManager(account2).installPlugin({
            plugin: address(tokenReceiverPlugin),
            manifestHash: bytes32(0),
            pluginInstallData: abi.encode(uint48(1 days)),
            dependencies: new FunctionReference[](0)
        });
    }

    function test_installPlugin_interfaceNotSupported() public {
        vm.startPrank(owner2);

        address badPlugin = address(1);
        vm.expectRevert(
            abi.encodeWithSelector(
                PluginManagerInternals.PluginInterfaceNotSupported.selector,
                address(badPlugin)
            )
        );
        IPluginManager(account2).installPlugin({
            plugin: address(badPlugin),
            manifestHash: bytes32(0),
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });
    }

    function test_installPlugin_alreadyInstalled() public {
        vm.startPrank(owner2);

        bytes32 manifestHash = keccak256(
            abi.encode(tokenReceiverPlugin.pluginManifest())
        );
        IPluginManager(account2).installPlugin({
            plugin: address(tokenReceiverPlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(uint48(1 days)),
            dependencies: new FunctionReference[](0)
        });

        vm.expectRevert(
            abi.encodeWithSelector(
                PluginManagerInternals.PluginAlreadyInstalled.selector,
                address(tokenReceiverPlugin)
            )
        );
        IPluginManager(account2).installPlugin({
            plugin: address(tokenReceiverPlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(uint48(1 days)),
            dependencies: new FunctionReference[](0)
        });
    }

    function test_uninstallPlugin_default() public {
        vm.startPrank(owner2);

        ComprehensivePlugin plugin = new ComprehensivePlugin();
        bytes32 manifestHash = keccak256(abi.encode(plugin.pluginManifest()));
        IPluginManager(account2).installPlugin({
            plugin: address(plugin),
            manifestHash: manifestHash,
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });

        vm.expectEmit(true, true, true, true);
        emit PluginUninstalled(address(plugin), true);
        IPluginManager(account2).uninstallPlugin({
            plugin: address(plugin),
            config: "",
            pluginUninstallData: ""
        });
        address[] memory plugins = IAccountLoupe(account2)
            .getInstalledPlugins();
        assertEq(plugins.length, 1);
        assertEq(plugins[0], address(singleOwnerPlugin));
    }

    function test_uninstallPlugin_manifestParameter() public {
        vm.startPrank(owner2);

        ComprehensivePlugin plugin = new ComprehensivePlugin();
        bytes memory serializedManifest = abi.encode(plugin.pluginManifest());
        bytes32 manifestHash = keccak256(serializedManifest);
        IPluginManager(account2).installPlugin({
            plugin: address(plugin),
            manifestHash: manifestHash,
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });

        vm.expectEmit(true, true, true, true);
        emit PluginUninstalled(address(plugin), true);
        IPluginManager(account2).uninstallPlugin({
            plugin: address(plugin),
            config: serializedManifest,
            pluginUninstallData: ""
        });
        address[] memory plugins = IAccountLoupe(account2)
            .getInstalledPlugins();
        assertEq(plugins.length, 1);
        assertEq(plugins[0], address(singleOwnerPlugin));
    }

    function test_uninstallPlugin_invalidManifestFails() public {
        vm.startPrank(owner2);

        ComprehensivePlugin plugin = new ComprehensivePlugin();
        bytes memory serializedManifest = abi.encode(plugin.pluginManifest());
        bytes32 manifestHash = keccak256(serializedManifest);
        IPluginManager(account2).installPlugin({
            plugin: address(plugin),
            manifestHash: manifestHash,
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });

        // Attempt to uninstall with a blank manifest
        PluginManifest memory blankManifest;

        vm.expectRevert(
            abi.encodeWithSelector(
                PluginManagerInternals.InvalidPluginManifest.selector
            )
        );
        IPluginManager(account2).uninstallPlugin({
            plugin: address(plugin),
            config: abi.encode(blankManifest),
            pluginUninstallData: ""
        });
        address[] memory plugins = IAccountLoupe(account2)
            .getInstalledPlugins();
        assertEq(plugins.length, 2);
        assertEq(plugins[0], address(singleOwnerPlugin));
        assertEq(plugins[1], address(plugin));
    }

    function _installPluginWithExecHooks()
        internal
        returns (MockPlugin plugin)
    {
        vm.startPrank(owner2);

        plugin = new MockPlugin(manifest);
        bytes32 manifestHash = keccak256(abi.encode(plugin.pluginManifest()));

        IPluginManager(account2).installPlugin({
            plugin: address(plugin),
            manifestHash: manifestHash,
            pluginInstallData: "",
            dependencies: new FunctionReference[](0)
        });

        vm.stopPrank();
    }

    // Internal Functions

    function _printStorageReadsAndWrites(address addr) internal {
        (bytes32[] memory accountReads, bytes32[] memory accountWrites) = vm
            .accesses(addr);
        for (uint256 i = 0; i < accountWrites.length; i++) {
            bytes32 valWritten = vm.load(addr, accountWrites[i]);
            // solhint-disable-next-line no-console
            console.log(
                string.concat(
                    "write loc: ",
                    vm.toString(accountWrites[i]),
                    " val: ",
                    vm.toString(valWritten)
                )
            );
        }

        for (uint256 i = 0; i < accountReads.length; i++) {
            bytes32 valRead = vm.load(addr, accountReads[i]);
            // solhint-disable-next-line no-console
            console.log(
                string.concat(
                    "read: ",
                    vm.toString(accountReads[i]),
                    " val: ",
                    vm.toString(valRead)
                )
            );
        }
    }
}
