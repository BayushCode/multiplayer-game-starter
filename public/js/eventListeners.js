addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  )
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  socket.emit('shoot', {x:playerPosition.x,y:playerPosition.y,angle})
  //projectiles.push(
    //new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  //)
})
