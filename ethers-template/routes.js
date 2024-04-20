const { Router } = require("express");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
// const walk = require("./compile.js");
require('dotenv').config();

const router = Router();

 // Assuming your Google API key is stored in GOOGLE_API_KEY environment variable

router.post("/prompt", async (req, res) => {

    
    try {
        console.log(req.body);
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
        const {code} = req.body;
        let text1 = "You're tasked with optimizing gas fees for deploying a smart contract. The project involves meticulously calculating the estimated gas fee based on the bytecode of the contract. Now, the objective is to reduce these fees to their minimal extent before deployment, ensuring the contract remains efficient and functional. Explore strategies and techniques to optimize the contract, aiming for maximal gas fee reduction while maintaining integrity and functionality. Provide insights, recommendations, and steps to achieve this optimization goal. You are tasked to give most optimized version of this contract code only and no other explanation  ";
        let prompt = text1.concat(code);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const filePath = path.join(__dirname, 'contracts/erc20.sol');
        const text = response.text();
        fs.writeFileSync(filePath, text);
        res.json({text});
          
          
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating text' });
    }
});

// router.get("/walk", async (req, res) => {
//     try {
//         const sourceFolderPath = req.query.sourceFolderPath; // Assuming the source folder path is sent as a query parameter
//         const result = await walk(sourceFolderPath);
//         res.json(result);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred while walking the folder' });
//     }
// });

module.exports = router;
