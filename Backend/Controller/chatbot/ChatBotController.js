const run = require('./geminiApi');

const getBotResponse = async (req,res) => {
    try{
        const {prompt} = req.body;

        const botResponse = await run(prompt);

        res.json(botResponse);
        console.log(botResponse);

    }catch(err){
        console.log(err);
    }
}

module.exports = {getBotResponse};