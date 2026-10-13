const express = require('express');
const router = require('./routes/index.js');

const app = express();

app.use(express.json());
app.use('/api', router);
//ruta raiz 
app.get("/",(req,res)=>{
    res.json({mensaje: "ruta raiz FICHA 3407180" })
})
module.exports = app;