require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const dns = require('dns')
const URL = require('url').URL;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let storingObj = {}
const randomInt = () => {
  return Math.floor(Math.random() * 1000).toString();
}

app.post('/api/shorturl', (req, res) => {
  const origUrl = req.body.url
  const urlObject = new URL(origUrl);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if(err){
      res.json({ error: 'invalid url' })
    }else {
      storingObj[origUrl] = storingObj[origUrl] ? storingObj[origUrl] : randomInt()
      res.json({original_url: origUrl, short_url: storingObj[origUrl]})
    }
  })  
})

app.get('/api/shorturl/:short', (req, res) => {
  const short = req.params.short
  
  if (Object.values(storingObj).includes(short)){
    const origUrl = Object.keys(storingObj)[0]
    res.redirect(origUrl)
  }
  else{
    res.json({original_url: " Not found"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
