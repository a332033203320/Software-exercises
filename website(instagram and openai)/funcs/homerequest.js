const Request = require('./synchttps.js');
const API = require('./data.js');

async function homerequest() {
   const posts = await Request({ 
      host: 'graph.instagram.com',
      //port: '80',
      path: '/me/media?fields=id,caption,media_type,timestamp&access_token='+API.InstagramAccessToken,
      method: 'GET',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
   },{});
   let onlydata = posts.Data;
   if(onlydata.hasOwnProperty("error")) { 
      console.log(onlydata.error.message);
      return ;
   }
   onlydata = onlydata.data;
  
   const promises = onlydata.map((item) => {   
      if(item.media_type != "CAROUSEL_ALBUM")  {
         delete item.media_type;
         let json = {};
         json.mainid = item.id;
         json.id = [];
         json.id.push(item.id);
         return json; 
      }
      return Request({ 
         host : 'graph.instagram.com',
         //port: '80',
         path: '/'+item.id+'/children?access_token='+API.InstagramAccessToken,
         method: 'GET',
         timeout: 5000,
         headers: { 'Content-Type': 'application/json' }
      },{}).then((response) => {   
         delete item.media_type;
         let json = {};
         json.mainid = item.id;    
         json.id = [];
         response.Data.data.map((res)=> { json.id.push(res.id); });
         return json;
      });
   });
   const postsWithComments = await Promise.all(promises);
   //console.log(onlydata);
   let result = [];
   postsWithComments.map((item) => {
     item.id.map((data) => { 
        let json = {};
        json.mainid= item.mainid;
        json.id = data; 
        result.push(json);
      });
   });
   const finalresult = result.map((item) => {
      return Request({ 
         host : 'graph.instagram.com',
         //port: '80',
         path: '/'+item.id+'?fields=media_url&access_token='+API.InstagramAccessToken,
         method: 'GET',
         timeout: 5000,
         headers: { 'Content-Type': 'application/json' }
      },{}).then((response) => {   
         response.Data.mainid = item.mainid;
         return response;
      });
   });
   const finalresultcomments =  await Promise.all(finalresult);
   //console.log(finalresultcomments);
   onlydata.map((data) => {
      data.media = [];
      finalresultcomments.map((item) => {      
         if(data.id == item.Data.mainid) {
            delete item.Data.mainid;
            delete item.Data.id;
            data.media.push(item.Data.media_url);
         }       
      });
   });
   result = {};
   result.data = onlydata;
   return result;
}

module.exports = homerequest;
