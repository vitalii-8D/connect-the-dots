const PORT = 3000;
const DOCROOT = './../docs/'

const http = require('http')
const path = require('path')
const express = require('express')

const app = express()
const server = http.createServer(app)

const buildRoot = path.join(__dirname, DOCROOT)
const staticContent = express.static(buildRoot)
app.use(staticContent)


server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
