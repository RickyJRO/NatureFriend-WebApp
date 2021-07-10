const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
var publicDir = require('path').join(__dirname, '/userimg');
var postDir = require('path').join(__dirname, '/postimgs');
const auth = require("./api/auth/auth")
const perfil = require("./api/profiles/profiles")
const feed = require("./api/feed/feed")
const alerta = require("./api/alertas/alertas")
const path = require("path")
var helmet = require('helmet')

//Helmet for HTTP protection
app.use(helmet({
  contentSecurityPolicy: false,
}))

//Limitador de Requests
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 
});

app.use(express.static(postDir))
app.use(express.static(publicDir));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(auth);
app.use(perfil);
app.use(feed);
app.use(alerta);
app.use(limiter);

const port = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, "frontend/build")))
app.get("*",(req, res) => {
  res.sendFile(path.join(__dirname,"frontend/build/index.html"))
})

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
