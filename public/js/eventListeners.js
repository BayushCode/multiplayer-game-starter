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
  )
  
  if (frontEndPlayers[socket.id].type == "single")
  {
    socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
  }
  //projectiles.push(
    //new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  //)
})
