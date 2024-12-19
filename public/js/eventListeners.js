addEventListener('click', (event) => {
  const canvas = document.querySelector("canvas")
  const { top, left } = canvas.getBoundingClientRect()
  
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  
  const angle = Math.atan2(
    event.clientY * devicePixelRatio - top - playerPosition.y,
    event.clientX * devicePixelRatio - left - playerPosition.x
  ) * (180 / Math.PI)

  
  if (frontEndPlayers[socket.id].type == 2)
  {
    for (let index = 0; index < 5; index++) {
      const angle = Math.atan2(
        (event.clientY + index*10) * devicePixelRatio - top - playerPosition.y,
        (event.clientX + index*10) * devicePixelRatio - left - playerPosition.x
      ) * (180 / Math.PI)
      socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
    }
  }else{
    socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
  }
})
