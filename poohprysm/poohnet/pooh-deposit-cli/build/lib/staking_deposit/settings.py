from typing import Dict, NamedTuple
from eth_utils import decode_hex

DEPOSIT_CLI_VERSION = '2.5.3'


class BaseChainSetting(NamedTuple):
    NETWORK_NAME: str
    GENESIS_FORK_VERSION: bytes
    GENESIS_VALIDATORS_ROOT: bytes


MAINNET = 'mainnet'
TESTNET = 'testnet'
DEVNET = 'devnet'

# Mainnet setting
MainnetSetting = BaseChainSetting(
    NETWORK_NAME=MAINNET, GENESIS_FORK_VERSION=bytes.fromhex('2F1A0000'),
    GENESIS_VALIDATORS_ROOT=bytes.fromhex('f9811c9dc8dfe7d7fa1d05b31474c97762c70fc7411b5020e6a57c94d9cd96c8'))
# Testnet setting
TestnetSetting = BaseChainSetting(
    NETWORK_NAME=TESTNET, GENESIS_FORK_VERSION=bytes.fromhex('2F1C0000'),
    GENESIS_VALIDATORS_ROOT=bytes.fromhex('e63460dc044e056f26ca8f7406a18867d31f1ec195322f428b5918d4b0153050'))
# Devnet setting
DevnetSetting = BaseChainSetting(
    NETWORK_NAME=DEVNET, GENESIS_FORK_VERSION=bytes.fromhex('2F1C0000'),
    GENESIS_VALIDATORS_ROOT=bytes.fromhex('7f0f27d8765475e82f1df899a7abfcdfabdab857133edf6a86d8df1bb0b2bdcf'))

ALL_CHAINS: Dict[str, BaseChainSetting] = {
    MAINNET: MainnetSetting,
    TESTNET: TestnetSetting,
    DEVNET: DevnetSetting,
}


def get_chain_setting(chain_name: str = MAINNET) -> BaseChainSetting:
    return ALL_CHAINS[chain_name]


def get_devnet_chain_setting(network_name: str,
                             genesis_fork_version: str,
                             genesis_validator_root: str) -> BaseChainSetting:
    return BaseChainSetting(
        NETWORK_NAME=network_name,
        GENESIS_FORK_VERSION=decode_hex(genesis_fork_version),
        GENESIS_VALIDATORS_ROOT=decode_hex(genesis_validator_root),
    )
