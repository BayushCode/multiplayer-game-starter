const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io();

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2

let mouse = {
  x:undefined,
  y:undefined
}

const frontEndPlayers = {}
const frontEndProjectiles = {}

socket.on('updateProjectiles', (backEndProjectiles) =>{
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id]

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity
      })
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y
    }
  }
})

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

  for (const id in frontEndProjectiles)
  {
    frontEndProjectiles[id].draw()
  }

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
  mouse.x = e.clientX
  mouse.y = e.clientY

  c.beginPath()
  c.moveTo(currentPlayer.x,currentPlayer.y)
  //c.moveTo(0,0)
  c.lineTo(mouse.x,mouse.y)
  c.lineWidth = 5
  c.strokeStyle = "rgba(255,255,255,0.5)"
  c.stroke()

})