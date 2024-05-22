const express = require('express')
const{createProxyMiddleware} = require('http-proxy-middleware')
const app = express()
const servers = ["http://localhost:3000", "http://localhost:4000", "http://localhost:5000"]
let currentServer = 0
const proxy = (req, res, next)=>{
    const targetServer = servers[currentServer]
    currentServer = (currentServer + 1)%servers.length
    createProxyMiddleware({
         target : targetServer,
         changeOrigin : true,
         onProxyReq : (proxyReq, req, res)=>{
            proxyReq.setHeader('X-Special-Proxy-Header', 'foobar'),
            proxyReq.removeHeader('X-Removed-Header')
            if(proxyReq.path==='/old-path'){
                proxyReq.path==='/new-path'
            }
         },
         onError : (err, req, res)=>{
            res.status(500).send('Error connecting to target server')
         },
    })(req, res, next)
}
app.use('/', proxy)
app.listen(8080, ()=>{
    console.log('load balancer running on port 8080')
})