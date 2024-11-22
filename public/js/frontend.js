const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io();

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

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
        color:'white'})
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
