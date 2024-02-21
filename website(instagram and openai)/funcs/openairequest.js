const Request = require('./synchttps.js');
const API = require('./data.js');

async function openairequest(body) {
    const option = {
        host : 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        timeout: 30000,
        headers: { 
            'Authorization': ' Bearer ' + API.OpenAIAccessToken,
            'Content-Type': 'application/json',          
        },  
    };
    const post = await Request(option, body);
    return post;
}

module.exports = openairequest;