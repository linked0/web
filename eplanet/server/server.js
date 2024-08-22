const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const Web3 = require("web3");
const abiDeletator = require("./abi-delegator.js");
const abiToken = require("./abi-token.js");

require(`dotenv`).config({ path: "../.env" });

const app = express();

// Connect to MySQL database from the server
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
}
);

// Define a model
const Request = sequelize.define('Request', {
    address: Sequelize.STRING,
    index: Sequelize.INTEGER,
    tx: Sequelize.STRING,
    status: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
});

// Command line argument for production/localnet
const network = process.argv[2] || 'localnet';

// Configure Web3
const providerURL = network === 'localnet' ? process.env.LOCALNET_URL : process.env.HOLESKY_URL;
const web3 = new Web3(providerURL);
const account = network === 'localnet' ? web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_KEY) :
    web3.eth.accounts.privateKeyToAccount(process.env.HOLESKY_ADMIN_KEY);

console.log("Account: ", account);

// Contract address and ABI
let delegatorContract = new web3.eth.Contract(abiDeletator, process.env.TRANSACTION_DELEGATOR_CONTRACT);
let tokenContract = new web3.eth.Contract(abiToken, process.env.MINTABLE_TOKEN);

// Sync the model with the database
sequelize.sync();

// Middleware
app.use(express.json());

// Endpoints
app.post('/mint', async (req, res) => {
    const { address } = req.body;
    const query = `SELECT * FROM Requests WHERE address='${address}' ORDER BY id DESC LIMIT 1`;
    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    let index = (result.length === 0) ? 0 : result[0].index + 1;
    const tx = "0x";
    const status = 0;
    const createdAt = new Date();
    const request = await Request.create({
        address, index, tx, status, createdAt
    });
    delegatorContract.methods
        .mint(address, index)
        .send({ from: account.address, gas: 3000000 })
        .then((receipt) => {
            console.log("Mint transaction hash: ", receipt.transactionHash);
        })
        .catch((error) => {
            console.error("Error sending mint transaction:", error);
        });
    res.json(request);
});

app.get('/balanceOf', async (req, res) => {
    const { address } = req.body;
    tokenContract.methods
        .balanceOf(address)
        .call({ from: account.address, gas: 3000000 })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error("Error balanceOf call:", error);
        });
});

// Protection middleware
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token !== 'secret-token') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});