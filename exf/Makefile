-include .env

.PHONY: build

help: 
	@echo "Usage:"
	@echo "  make deploy-poohnet-fund-localnet\n    FOR: delploy PoohnetFund contract to localnet"
	@echo ""
	@echo "  make test-poohnet-fund-owner\n    FOR: test for the PoohnetFund in localnet"
	@echo ""
	@echo "  make deploy-ep-local\n    FOR: test for the EntryPoint in localnet"
	@echo ""
	@echo "  make deploy-ma-local\n    FOR: test for the UpgradeableModularAccount in localnet"

build:; forge build

deploy-poohnet-fund-localnet:; forge script script/poohnet-fund/DeployPoohnetFund.s.sol --rpc-url localnet  --private-key $(PRIVATE_KEY) --broadcast

test-poohnet-fund-owner:; forge test -vvv --mc PoohnetFundTest --fork-url localnet

deploy-ep-local:; forge script script/erc6900/DeployEntryPoint.s.sol --rpc-url ${RPC_URL_LOCALNET}  --private-key $(PRIVATE_KEY) --broadcast
deploy-ma-local:; forge script script/erc6900/DeployModularAccount.s.sol --rpc-url ${RPC_URL_LOCALNET}  --private-key $(PRIVATE_KEY) --broadcast