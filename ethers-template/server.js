const express = require('express');
const { Network, Alchemy, Utils } = require('alchemy-sdk');
const { ethers } = require('ethers');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");
const routes = require('./routes');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);




async function getCurrentGasPrice() {
  try {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: process.env.API_KEY
      }
    });

    if (response.data && response.data.result) {
      const currentGasPrice = response.data.result.ProposeGasPrice;
      console.log('Current gas price (in Gwei):', currentGasPrice);
      return currentGasPrice;
    } else {
      console.error('Failed to fetch current gas price:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching current gas price:', error);
    return null;
  }
}

var opcodes = {
  "0x00": 0, "0x01": 3, "0x02": 5, "0x03": 3, "0x04": 5, "0x05": 5, "0x06": 5, "0x07": 5, "0x08": 8, "0x09": 8,
  "0x0a": 10, "0x0b": 5, "0x10": 3, "0x11": 3, "0x12": 3, "0x13": 3, "0x14": 3, "0x15": 3, "0x16": 3, "0x17": 3,
  "0x18": 3, "0x19": 3, "0x1a": 3, "0x1b": 3, "0x1c": 3, "0x1d": 3, "0x20": 30, "0x30": 2, "0x31": 700, "0x32": 2,
  "0x33": 2, "0x34": 2, "0x35": 3, "0x36": 2, "0x37": 3, "0x38": 2, "0x39": 3, "0x3a": 2, "0x3b": 700, "0x3c": 700,
  "0x3d": 2, "0x3e": 3, "0x3f": 700, "0x40": 20, "0x41": 2, "0x42": 2, "0x43": 2, "0x44": 2, "0x45": 2, "0x46": 2,
  "0x48": 2, "0x50": 2, "0x51": 3, "0x52": 3, "0x53": 3, "0x54": 800, "0x55": 20000, "0x56": 8, "0x57": 10,
  "0x58": 2, "0x59": 2, "0x5a": 2, "0x5b": 1, "0x60": 3, "0x61": 3, "0x62": 3, "0x63": 3, "0x64": 3, "0x65": 3,
  "0x66": 3, "0x67": 3, "0x68": 3, "0x69": 3, "0x6a": 3, "0x6b": 3, "0x6c": 3, "0x6d": 3, "0x6e": 3, "0x6f": 3,
  "0x70": 3, "0x71": 3, "0x72": 3, "0x73": 3, "0x74": 3, "0x75": 3, "0x76": 3, "0x77": 3, "0x78": 3, "0x79": 3,
  "0x7a": 3, "0x7b": 3, "0x7c": 3, "0x7d": 3, "0x7e": 3, "0x7f": 3, "0x80": 3, "0x81": 3, "0x82": 3, "0x83": 3,
  "0x84": 3, "0x85": 3, "0x86": 3, "0x87": 3, "0x88": 3, "0x89": 3, "0x8a": 3, "0x8b": 3, "0x8c": 3, "0x8d": 3,
  "0x8e": 3, "0x8f": 3, "0x90": 3, "0x91": 3, "0x92": 3, "0x93": 3, "0x94": 3, "0x95": 3, "0x96": 3, "0x97": 3,
  "0x98": 3, "0x99": 3, "0x9a": 3, "0x9b": 3, "0x9c": 3, "0x9d": 3, "0x9e": 3, "0x9f": 3, "0xa0": 375, "0xa1": 750,
  "0xa2": 1125, "0xa3": 1500, "0xa4": 1875, "0xf0": 32000, "0xf1": 0, "0xf2": 0,
  "0xf3": 0, "0xf4": 0, "0xf5": "", "0xfa": 40, "0xfd": 0, "0xfe": 0, "0xff": 5000
}



async function estimateGasCost() {
  try {
    const currentGasPrice = await getCurrentGasPrice();
    if (!currentGasPrice) {
      console.error('Failed to fetch current gas price');
      return;
    }

    let totalGas = 0;
    let i = 0;
    const contractData = await fs.readFile('build/News.json', 'utf-8');
    const parsedContractData = JSON.parse(contractData);
    const bytecode = parsedContractData.bytecode;
    console.log('Bytecode:', bytecode.length);

    while (i < bytecode.length) {
      const opcode = "0x" + bytecode.slice(i, i + 2);
      const gasCost = opcodes[opcode];
      console.log('Opcode:', opcode, 'Gas cost:', gasCost, 'Total gas:', totalGas, 'i:', i);

      if (gasCost !== undefined) {
        // Check if the opcode is a PUSH instruction and get the size of the operand
        if (opcode >= '0x60' && opcode <= '0x7f' && i + 2 < bytecode.length) {
          const operandSize = parseInt(bytecode.slice(i + 2, i + 4), 16) * 2;
          totalGas += gasCost + Math.ceil(operandSize / 2); // Additional cost for PUSH instruction
          i += operandSize + 2;
        } else {
          totalGas += gasCost;
          i += 2;
        }
      } else {
        totalGas += 0;
        i += 2;
      }
    }

    console.log('total gas required for contract:', totalGas);

    const GAS_PER_OPCODE = currentGasPrice; // Adjust this value based on your gas cost per opcode

    // Calculate the estimated gas cost based on opcode count
    const estimatedGasCost = GAS_PER_OPCODE * totalGas;
    console.log('Estimated gas cost:', estimatedGasCost);
  } catch (error) {
    console.error('Error estimating gas cost:', error);
    return -1; // Return -1 if an error occurs
  }
}



async function startserver(){
  try {
    await estimateGasCost();

    // Start the server after gas estimation
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

startserver();
