const app = require('./app')
const socket = require('socket.io')
const { v4: uuidv4 } = require('uuid') // 生成随机id

const PORT = process.env.PORT || 9000

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

let peers = []

// 定义广播类型
const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
}
// 监听连接事件
io.on('connection', (socket) => {
  socket.emit('connection', null)
  console.log('有新的用户加入房间')
  console.log('socket.id', socket.id)

  // 有用户进入大厅，注册
  socket.on('registerNewUser', (data) => {
    const { username, socketId } = data
    peers.push({ username, socketId })
    console.log('注册新用户')
    console.log('peers', peers)
    // 向所有在线的用户广播，发送活跃用户
    io.sockets.emit('broadcast', {
      type: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    })
  })

  socket.on('disconnect', () => {
    console.log('有用户离开房间')
    peers = peers.filter((peer) => peer.socketId !== socket.id)
    io.sockets.emit('broadcast', {
      type: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    })
  })
})
