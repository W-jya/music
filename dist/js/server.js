var express = require('express');
var app = new express();
app.use(express.static('./page'));
app.listen(8080);//默认访问80端口，默认访问index.js