const express = require('express');
const compression = require('compression');
const app = express();
app.use(compression());
const port = process.env.PORT || 5000;
const path = require('path');
const mockRouter = require('./mock');
const proxy = require('http-proxy-middleware');

// http://220.163.106.227:9102/crm-fd/api/
app.use('/crm-fd/api', proxy({
  target: 'http://220.163.106.227:9102', // target host
  // target: 'http://192.168.1.154:8093', // target host
  // target: 'http://192.168.110.227:8093', // 县卫本地
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
}));

app.use('/', mockRouter);

if(process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

// NODE_ENV=production node server/index.js
