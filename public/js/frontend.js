const e = require("express");

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io();

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2

var mouse = {
  x:undefined,
  y:undefined
}

const frontEndPlayers = {}

socket.on('updatePlayers', (backendPlayers) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id]

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({x:backendPlayer.x,
        y:backendPlayer.y,
        radius:10,
        color:backendPlayer.color})
      }else{
        frontEndPlayers[id].x = backendPlayer.x
        frontEndPlayers[id].y = backendPlayer.y
      }
  }

  for (const id in frontEndPlayers)
  {
    if (!backendPlayers[id])
    {
      delete frontEndPlayers[id]
    }
  }
})

let animationId

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (const id in frontEndPlayers)
  {
    const player = frontEndPlayers[id]
    player.draw()
    frontEndPlayers[id].draw()
  }

  c.arc(mouse.x,mouse.y,10,0,Math.PI*2,false)
  c.fillStyle = "rgba(0,0,0,0.5)"
  c.fill()
}

animate()

const keys = {
  w: {
    pressed:false
  },
  d: {
    pressed:false
  },
  a: {
    pressed:false
  },
  s : {
    pressed:false
  }
}
setInterval( () => {
  if (keys.w.pressed)
  {
    frontEndPlayers[socket.id].y -= 5
    socket.emit('keydown', 'w')
  }
  if (keys.s.pressed)
  {
    frontEndPlayers[socket.id].y += 5
    socket.emit('keydown', 's')
  }
  if (keys.a.pressed)
  {
    frontEndPlayers[socket.id].x -= 5
    socket.emit('keydown', 'a')
  }
  if (keys.d.pressed)
  {
    frontEndPlayers[socket.id].x += 5
    socket.emit('keydown', 'd')
  }
}, 15)

window.addEventListener ('keydown', (e) => {
  if (!frontEndPlayers[socket.id]) return
  switch (e.key) {
    case 'w':
    keys.w.pressed = true
    break
    case 'a':
    keys.a.pressed = true
    break
    case 's':
    keys.s.pressed = true
    break
    case 'd':
    keys.d.pressed = true
    break
  }
})

window.addEventListener ('keyup', (e) => {
  if (!frontEndPlayers[socket.id]) return
  switch (e.key) {
    case 'w':
    keys.w.pressed = false
    break
    case 'a':
    keys.a.pressed = false
    break
    case 's':
    keys.s.pressed = false
    break
    case 'd':
    keys.d.pressed = false
    break
  }
})

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX * devicePixelRatio
  mouse.y = e.clientY * devicePixelRatio
})

window.addEventListener("mousedown", (e) => {
  const angle = Math.atan2(
    e.clientY * window.devicePixelRatio - playerPosition.y,
    e.clientX * window.devicePixelRatio - playerPosition.x
  )
  socket.emit("shoot", (frontEndPlayers[socket.id].x,frontEndPlayers[socket.id].y, angle))
})