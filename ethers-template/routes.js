const { Router } = require("express");
const axios = require("axios");
const fs = require('fs').promises;
const ts = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const solc = require('solc');
require('dotenv').config();
const compile = require('./compile.js');

const router = Router();




const estimateGasCost = async () => {
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

            let totalGas = 0;
            let i = 0;
            const contractData = await fs.readFile('build/News.json', 'utf-8');
            const parsedContractData = JSON.parse(contractData);
            const bytecode = parsedContractData.bytecode;
            console.log('Bytecode:', bytecode.length);

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
              
            while (i < bytecode.length) {
                const opcode = "0x" + bytecode.slice(i, i + 2);
                const gasCost = opcodes[opcode];

                if (gasCost !== undefined) {
                    if (opcode >= '0x60' && opcode <= '0x7f' && i + 2 < bytecode.length) {
                        const operandSize = parseInt(bytecode.slice(i + 2, i + 4), 16) * 2;
                        totalGas += gasCost + Math.ceil(operandSize / 2);
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

            const GAS_PER_OPCODE = currentGasPrice;
            const estimatedGasCost = GAS_PER_OPCODE * totalGas;
            console.log('Estimated gas cost:', estimatedGasCost);

            return estimatedGasCost;
        } else {
            console.error('Failed to fetch current gas price:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error estimating gas cost:', error);
        return null;
    }
}

router.post("/prompt", async (req, res) => {

    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
        const {code} = req.body;
        let text1 = "Generate an optimized smart contract that minimizes gas costs while ensuring efficient execution on the Ethereum blockchain. Consider factors such as code complexity, storage usage, and function calls to achieve the most gas-efficient solution. The contract should maintain all necessary functionalities and security measures while prioritizing gas optimization. return only the code output with language name with spdx license :";
        let prompt = text1.concat(code);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;


        const filePath = path.join(__dirname, 'contracts/erc20.sol');
        const text = response.text();
        ts.writeFileSync(filePath, text);
        res.json({text});
          
          
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating text' });
    }
});

router.get("/compile2", async (req, res) => {
    try {
        compile();
        res.status(200).send('Contract compiled successfully');
    } catch (error) {
        console.error('Error compiling contract:', error);
        res.status(500).json({ error: 'An error occurred while compiling the contract' });
    }
});

router.post("/compile1", async (req, res) =>{
    try{
        const {code} = req.body;
        const filePath = path.join(__dirname, 'contracts/erc20.sol');
        ts.writeFileSync(filePath, code);
        compile();
        res.status(200).send('Contract compiled successfully');
    }
    catch (error){
        console.error('Error compiling contract:', error);
        res.status(500).json({ error: 'An error occurred while compiling the contract' });

}});
    

router.get("/getestimated", async (req, res) => {
    try {
        const estimatedGasCost = await estimateGasCost();
        if (estimatedGasCost !== null) {
            res.status(200).json({ estimatedGasCost });
        } else {
            res.status(500).json({ error: 'Failed to estimate gas cost' });
        }
    } catch (error) {
        console.error('Error estimating gas cost:', error);
        res.status(500).json({ error: 'An error occurred while estimating gas cost' });
    }
});

module.exports = router;
