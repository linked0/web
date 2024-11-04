// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {EnumerableMap} from "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import {HookConfig, IModularAccount, ModuleEntity} from "../interfaces/IModularAccount.sol";
import {ExecutionDataView, IModularAccountView, ValidationDataView} from "../interfaces/IModularAccountView.sol";
import {HookConfigLib} from "../libraries/HookConfigLib.sol";
import {ExecutionStorage, ValidationStorage, getAccountStorage, toHookConfig} from "./AccountStorage.sol";

abstract contract ModularAccountView is IModularAccountView {
    using EnumerableSet for EnumerableSet.Bytes32Set;
    using EnumerableMap for EnumerableMap.AddressToUintMap;
    using HookConfigLib for HookConfig;

    /// @inheritdoc IModularAccountView
    function getExecutionData(bytes4 selector) external view override returns (ExecutionDataView memory data) {
        if (
            selector == IModularAccount.execute.selector || selector == IModularAccount.executeBatch.selector
                || selector == UUPSUpgradeable.upgradeToAndCall.selector
                || selector == IModularAccount.installExecution.selector
                || selector == IModularAccount.uninstallExecution.selector
        ) {
            data.module = address(this);
            data.allowGlobalValidation = true;
        } else {
            ExecutionStorage storage executionStorage = getAccountStorage().executionStorage[selector];
            data.module = executionStorage.module;
            data.skipRuntimeValidation = executionStorage.skipRuntimeValidation;
            data.allowGlobalValidation = executionStorage.allowGlobalValidation;

            uint256 executionHooksLen = executionStorage.executionHooks.length();
            data.executionHooks = new HookConfig[](executionHooksLen);
            for (uint256 i = 0; i < executionHooksLen; ++i) {
                data.executionHooks[i] = toHookConfig(executionStorage.executionHooks.at(i));
            }
        }
    }

    /// @inheritdoc IModularAccountView
    function getValidationData(ModuleEntity validationFunction)
        external
        view
        override
        returns (ValidationDataView memory data)
    {
        ValidationStorage storage validationStorage = getAccountStorage().validationStorage[validationFunction];
        data.isGlobal = validationStorage.isGlobal;
        data.isSignatureValidation = validationStorage.isSignatureValidation;
        data.isUserOpValidation = validationStorage.isUserOpValidation;
        data.validationHooks = validationStorage.validationHooks;

        uint256 execHooksLen = validationStorage.executionHooks.length();
        data.executionHooks = new HookConfig[](execHooksLen);
        for (uint256 i = 0; i < execHooksLen; ++i) {
            data.executionHooks[i] = toHookConfig(validationStorage.executionHooks.at(i));
        }

        bytes32[] memory selectors = validationStorage.selectors.values();
        uint256 selectorsLen = selectors.length;
        data.selectors = new bytes4[](selectorsLen);
        for (uint256 j = 0; j < selectorsLen; ++j) {
            data.selectors[j] = bytes4(selectors[j]);
        }
    }
}
