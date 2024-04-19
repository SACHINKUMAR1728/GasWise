const { Router } = require("express");
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const router = Router();


const config = new Configuration({
    apikey : process.env.apikey
})
const openai = new OpenAIApi(config);

router.post("/prompt", async(req,res)=>{
    try {
        const { prompt } = req.body;

        const completion = await openai.complete({
            engine: 'text-davinci-003', // Specify the engine you want to use
            prompt: prompt,
            maxTokens: 150, // Maximum number of tokens (words) to generate
            temperature: 0.7, // Controls the randomness of the generated text
            topP: 1, // Controls diversity of the generated text
            frequencyPenalty: 0, // Adjusts the frequency of the generated text
            presencePenalty: 0, // Adjusts the repetition of the generated text
            stop: '\n', // Stop generating text when encountering a newline
        });
        res.json(completion.data.choices[0].text);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating text' });
    }
});


module.exports = router;