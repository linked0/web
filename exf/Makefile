-include .env

.PHONY: build

help: 
	@echo "Usage:"
	@echo "  make deploy-poohnet-fund-localnet\n    FOR: delploy PoohnetFund contract to localnet"
	@echo ""
	@echo "  make balance-poohnet-fund-localnet\n    FOR: balace of the PoohnetFund in localnet"
	@echo ""
	@echo "  make deploy-ep-local\n    FOR: deploy EntryPoint in localnet"
	@echo ""
	@echo "  make deploy-ma-local\n    FOR: deploy the UpgradeableModularAccount in localnet"
	@echo ""
	@echo "  make create-account-local\n    FOR: create Abstraction Account in localnet"
	@echo ""
	@echo "  make initialize-account-local\n    FOR: initialize Abstraction Account in localnet"

build:; forge build

deploy-poohnet-fund-localnet:; forge script script/poohnet-fund/DeployPoohnetFund.s.sol --rpc-url localnet  --private-key $(PRIVATE_KEY) --broadcast

balance-poohnet-fund-localnet:; forge script script/poohnet-fund/BalanceFund.s.sol --rpc-url localnet  --private-key $(PRIVATE_KEY)

deploy-ep-local:; forge script script/erc6900/DeployEntryPoint.s.sol --rpc-url ${RPC_URL_LOCALNET}  --private-key $(PRIVATE_KEY) --broadcast

deploy-ma-local:; forge script script/erc6900/DeployModularAccount.s.sol --rpc-url ${RPC_URL_LOCALNET}  --private-key $(PRIVATE_KEY) --broadcast

deploy-sop-local:; forge script script/erc6900/DeploySingleOnwerPlugin.s.sol --rpc-url localnet --private-key $(PRIVATE_KEY) --broadcast

create-account-local:; forge script script/erc6900/CreateAccount.s.sol --rpc-url localnet --private-key $(PRIVATE_KEY) --broadcast 

initialize-account-local:; forge script -vvvv script/erc6900/InitializeAccount.s.sol --rpc-url localnet --private-key $(PRIVATE_KEY) --broadcast 