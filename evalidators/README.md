# validators
A validator list provision service for congress voting

## Testing
You can test the validator information server in your local machine as follows.
```shell
git clone https://github.com/zeroone-boa/validators.git
cd validators

# Run PostgreSQL locally.
docker-compose up -d 

cp -r env/.env.sample env/.env
npm install
npx hardhat compile
npx hardhat test

# Stop PostgreSQL
docker-compose down
```

### Mainnet
```shell
git clone https://github.com/zeroone-boa/validators.git
cd validators
npm install
npx hardhat compile
# 1. Set env/.env.
# 2. Change config/config.yaml to suit mainnet environment.
npm run start:mainnet
```

### Testnet
```shell
git clone https://github.com/zeroone-boa/validators.git
cd validators
npm install
npx hardhat compile
# 1. Set env/.env.
# 2. Change config/config.yaml to suit testnet environment.
npm run start:testnet
```

### Votera Testnet
```shell
git clone https://github.com/zeroone-boa/validators.git
cd validators
npm install
npx hardhat compile
# 1. Set env/.env.
# 2. Change config/config.yaml to suit votera testnet environment.
npm run start:votera
```

### Browser
http://localhost:3000/validators
