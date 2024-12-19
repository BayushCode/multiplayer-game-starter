const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {pingInterval:2000, pingTimeout:5000});

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backEndPlayers = {}
const backEndProjectiles = {}
let projectileId = 0

io.on('connection', (socket) => {
  console.log('a user connected');
  backEndPlayers[socket.id] = {
    x:500 * Math.random(),
    y:500 * Math.random(),
    color: 'hsl('+360*Math.random()+',100%,50%)',
    type: 1
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('disconnect', (reason) => {
    console.log(reason);
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('shoot', ({x,y,angle}) => {
    projectileId++

    const velocity = {
      x: Math.cos(angle) * 15,
      y: Math.sin(angle) * 15
    }

    const lifespan = 500

    backEndProjectiles[projectileId] = {
      x,
      y,
      velocity,
      playerId: socket.id
    }
    
    projectileTimeout = setTimeout(function(){
      delete backEndProjectiles[projectileId]
      console.log("deleted " + projectileId)}, lifespan)
  })

  socket.on('keydown', (key) => {
    switch (key) {
      case 'w':
      backEndPlayers[socket.id].y -= 5
      break
      case 'a':
      backEndPlayers[socket.id].x -= 5
      break
      case 's':
     backEndPlayers[socket.id].y += 5
      break
      case 'd':
     backEndPlayers[socket.id].x += 5
      break
    }
  })
});



setInterval( () => {
  io.emit('updateProjectiles', backEndProjectiles)
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
