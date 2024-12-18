addEventListener('click', (event) => {
  const canvas = document.querySelector("canvas")
  const { top, left } = canvas.getBoundingClientRect()
  
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  
  

  
  if (frontEndPlayers[socket.id].type === "single")
  {
    for (let index = 0; index < 5; index++) {
      const angle = Math.atan2(
        (event.clientY + index * 10) * devicePixelRatio - top - playerPosition.y,
        (event.clientX + index*10) * devicePixelRatio - left - playerPosition.x
      )
      socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
    }

  }else{
    socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
  }
  //projectiles.push(
    //new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  //)
})
