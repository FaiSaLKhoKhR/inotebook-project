const connectToMongo = require('./db');
const express = require('express')
var cors = require("cors")
connectToMongo();

const app = express()
// const port = 3000
const port = 5000

app.use(cors())

//for jsonContent
app.use(express.json())

// Avaible Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// app.get('/', (req, res) => {
//   res.send('Hello Faisal Khokhar!')
// })

app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})



