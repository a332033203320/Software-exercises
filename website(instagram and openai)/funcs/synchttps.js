const http = require('http');
const https = require('https');

function Request(option, formdata) {
   const response = new Promise((resolve, reject) => {
      const req = https.request(option, (res) => {   
         var data = "";  
         res.on('data', (ch) => { data += ch; });
         res.on('end', () => { 
           try { resolve({ Data: JSON.parse(data) }); } //{ StatusCode: res.statusCode, Data: JSON.parse(data) }
           catch(error) { reject(error); }
         });  
      });
      req.on('error', (error) => { reject(error); });
      req.on('timeout', () => { req.destroy(); reject("time out"); });
      req.write(JSON.stringify(formdata));  //json data or others
      req.end();
   });
   return response;
 }

 module.exports = Request;