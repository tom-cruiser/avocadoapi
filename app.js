const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/remplaceTemplate');

////////////////////////////////////////////
/////////server 

const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/final/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/final/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/final/templates/template-product.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
        const dataObj = JSON.parse(data); 

const slugs = dataObj.map(el => slugify(el.productName, {lower:true}));
console.log(slugs);


const server = http.createServer((req,res)=>{
     const {query , pathname } = (url.parse(req.url,true));
     
    //overview page
    if(pathname === "/" || pathname === '/overview'){
        res.writeHead(200,{'content-type':'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join();
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml); 
        
        res.end(output);


        //products page
    } else if(pathname === '/product'){
    
        res.writeHead(200,{'content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);

        //api page
    }else if(pathname ==='/api'){

        
            res.writeHead(200,{'content-type':'application/json'});

            res.end(data);
        //page Not Found
    } else{
        res.writeHead(404);
        res.end("this page couldn't be found" );
    }
    
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("server started on port 8000 ");
});