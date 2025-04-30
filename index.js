process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import http from "http";
import fs from "fs/promises";
import axios from "axios";
import path from 'path';

const dataPath = path.join("data","data.json");
const PORT = 3000;
const url = "https://api.quotable.io/random";

const loadData = async(res)=>{
    const dataFile = await fs.readFile(dataPath,"utf-8");
    const finalDataFile = JSON.parse(dataFile);
    if(!finalDataFile[res.content]){
        finalDataFile[res.author] = res.content;
        await fs.writeFile(dataPath,JSON.stringify(finalDataFile),"utf-8");
        return;
    }
}

const serveFile = async(res,fileName,contentType)=>{
    try {
        const file = await fs.readFile(fileName,"utf-8");
        res.writeHead(200,{"Content-Type":contentType});
        res.end(file);
    } catch (error) {
        console.log(error);
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end("Error 404 Page not found. Try again later");
    }
}

const server = http.createServer(async(req,res)=>{
    console.log(req.url);
    if(req.url==="/"){
        return serveFile(res,"index.html","text/html");
    }
    else if(req.url==="/style.css"){
        return serveFile(res,"style.css","text/css");
    }
    else if(req.url==="/getQuote.js"){
        return serveFile(res,"getQuote.js","application/javascript");
    }
    else if(req.url==="/quote"){

        try {
            const response = await axios.get(url);
            await loadData(response.data);
            const JsonData = JSON.stringify(response.data);
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JsonData);
        } catch (error) {
            console.error(error);
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.end("Error fetching the data");
        }
    }
    else{
        res.writeHead(400,{"Content-Type":"text/plain"});
        res.end("Page not found");
    }
})

server.listen(PORT,()=>{
    console.log("Server is live!");
})