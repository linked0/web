-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""
	@echo ""
	@echo "  make fund [ARGS=...]\n    example: make fund ARGS=\"--network sepolia\""

all: clean install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install foundry-rs/forge-std@v1.5.3 --no-commit && forge install eth-infinitism/account-abstraction --no-commit && forge install vectorized/solady --no-commit && forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test

snapshot :; forge snapshot

format :; forge fmt

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(PRIVATE_KEY) --broadcast

deploy:
	forge script script/DeployEntryPoint.s.sol:EntryPoint $(NETWORK_ARGS)