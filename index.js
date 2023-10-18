const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.port || 3000

// middleware
app.use(cors())
app.use(express.json)

app.get('/', (req,res)=>{
    res.send('My Digital server is running')
})
app.listen(port, ()=>{
    console.log(`MY digital store server is running on port: ${port}`)
})