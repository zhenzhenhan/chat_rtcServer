const express = require('express')
const cors = require('cors')

const app = express()

// 解决跨域问题
app.use(cors())

module.exports = app
