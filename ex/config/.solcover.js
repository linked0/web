module.exports = {
    skipFiles: [
        "test/MyToken.sol",
        "account-abstraction/interfaces/IAccount.sol",
        "account-abstraction/interfaces/IAggregator.sol",
        "account-abstraction/interfaces/IEntryPoint.sol",
        "account-abstraction/interfaces/INonceManager.sol",
        "account-abstraction/interfaces/IPaymaster.sol",
    ],
    configureYulOptimizer: true,
    solcOptimizerDetails: {
        yul: true,
        yulDetails: {
            stackAllocation: true,
        },
    },
};