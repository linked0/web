-include .env

.PHONY: build

help: 
	@echo "Usage:"
	@echo "  make deploy-poohnet-fund-localnet\n    FOR: delploy PoohnetFund contract to localnet"
	@echo ""
	@echo "  make test-poohnet-fund-owner\n    FOR: test for the PoohnetFund in localnet"

build:; forge build

deploy-poohnet-fund-localnet:; forge script script/poohnet-fund/DeployPoohnetFund.s.sol --rpc-url localnet  --private-key $(PRIVATE_KEY) --broadcast

test-poohnet-fund-owner:; forge test -vvv --mc PoohnetFundTest --fork-url localnet