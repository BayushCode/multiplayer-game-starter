const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io();

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2


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
}

animate()

window.addEventListener ('keydown', (e) => {
  if (!frontEndPlayers[socket.id]) return
  switch (e.key) {
    case 'w':
    frontEndPlayers[socket.id].y -= 5
    socket.emit('keydown', 'w')
    break
    case 'a':
    frontEndPlayers[socket.id].x -=5
    socket.emit('keydown', 'a')
    break
    case 's':
    frontEndPlayers[socket.id].y += 5
    socket.emit('keydown', 's')
    break
    case 'd':
    frontEndPlayers[socket.id].x +=5
    socket.emit('keydown', 'd')
    break
  }
})