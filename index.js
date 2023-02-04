const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid') // 生成随机id

const app = express()
const PORT = process.env.PORT || 9000

// 解决跨域问题
app.use(cors())

// 创建服务
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// 创建socket服务
const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// 监听连接事件
io.on('connection', (socket) => {
  // console.log('socket connected')
  // socket.on('join', ({ name, room }) => {
  //   console.log(name, room)
  //   socket.join()
  // })
  socket.emit('connection', null)
  console.log('有新的用户加入房间')
  console.log('socket.id', socket.id)
})
