const express = require('express')
const app = express()

  app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ matchStatus: 'finished', winner: 'rmadrid', looser: 'juventus' }));
  })

var port = process.env.PORT || 5000
app.listen(port)