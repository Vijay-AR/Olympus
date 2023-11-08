const express = require('express');
const app = express();
// const port = 5000;
app.get('/', (req, res)=>{
    res.send("The Homepage");
})


app.listen(5000,()=>{
    console.log(`The port is running on PORT 5000...`)
});