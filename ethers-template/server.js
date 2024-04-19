const express = require('express');
const { Network, Alchemy, Utils } = require('alchemy-sdk');
const { ethers } = require('ethers');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require("cors");
const routes = require('./routes');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);
const settings = {
    apiKey: "IkpHDIoGH7Y_piYkeYMoannQqQGOLLUi",
    network: Network.ETH_SEPOLIA, // Specify the Ethereum network
};

const alchemy = new Alchemy(settings);
const privateKey = '1b9377eeb2c40ad78b4d2e436d27f72d630bb7f06db1ad5f5749aa5605b1c173';
const wallet = new ethers.Wallet(privateKey, alchemy);
const signer = wallet.connect(alchemy);
console.log('Signer address:', signer.address);


async function getCurrentGas() {
    const currentGasInHex = await alchemy.core.getGasPrice();

    console.log(
        'The current gas cost on the network is: ' +
        Utils.formatUnits(currentGasInHex, 'gwei') +
        ' gwei'
    );
}

async function estimateGasCost() {
    try {
        // Read the compiled contract JSON file
        const contractData = await fs.readFile('build/News.json', 'utf-8');
        const parsedContractData = JSON.parse(contractData);
        const bytecode = parsedContractData.bytecode;
        const opcodeCount = bytecode.match(/(?:5[1-9a-f]|6[0-6a-f])/g).length;
        const currentGasInHex = await alchemy.core.getGasPrice();
        var newprice = Utils.formatUnits(currentGasInHex, 'gwei');

        const GAS_PER_OPCODE = newprice; // Adjust this value based on your gas cost per opcode

        // Calculate the estimated gas cost based on opcode count
        const estimatedGasCost = GAS_PER_OPCODE * opcodeCount;

        console.log('Estimated gas cost:', estimatedGasCost);


        console.log('Opcode count:', opcodeCount);


    } catch (error) {
        console.log('Error estimating gas cost:', error);
    }
}



(async () => {
    try {
        await getCurrentGas();
        await estimateGasCost();

        // Start the server after gas estimation
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
