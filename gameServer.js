exports.Game = function(options) {
	this.id = options.id
	this.players = {}
	this.playersMax = options.playersMax
        this.mainLoop
        this.broadcast = options.broadcast
        this.start()
}

exports.Game.prototype.reset = function(){
  var p
  this.removeDC()
  for(p in this.players){
    this.players[p].x = 50
    this.players[p].y = 50
    this.players[p].wall = []
    this.players[p].previousPlaces = []
    this.players[p].alive = true
    this.players[p].setGhost()
  }
  this.broadcast(this,{code: "reset", players: this.getFormattedAllPlayers()})
}

exports.Game.prototype.sendGameState = function(){
  var players = this.getAlivePlayers()
  this.broadcast(
    this,
    {
      code: "newGameState",
      players: players
    }
    )
}

exports.Game.prototype.calculateNextFrame = function() {
  var player, playerBis;
  for(p in this.players){
    player = this.players[p]
    if(player.alive){
      player.move()
      for(pbis in this.players){
        playerBis = this.players[pbis]
        if(!playerBis.ghost && !player.ghost){
          player.collision(playerBis)
        }
      }
    }
  }
  this.checkIfWon()
  this.sendGameState()
}

exports.Game.prototype.start = function() {
  this.mainLoop = setInterval(this.calculateNextFrame.bind(this), 1000/30)
}

exports.Game.prototype.getAlivePlayers = function(withWall){
  var pl = {}, p
  for(p in this.players){
    pl[p] = this.players[p].alive ? this.getFormattedPlayer(p, withWall) : undefined
  }
  return pl }

exports.Game.prototype.getFormattedAllPlayers = function(withWall) {
  var pl = {}, p
  for (p in this.players) {
    pl[p] = this.getFormattedPlayer(p, withWall)
  }
  return pl
}

exports.Game.prototype.getFormattedPlayer = function(playerID, withWall) {
  var player = this.players[playerID]
  return {
    id: playerID,
    x : player.x,
    y : player.y,
    direction : player.direction,
    ghost: player.ghost,
    wall: withWall ? player.wall : undefined

  }
}

exports.Game.prototype.checkIfWon = function(){
  var pl, alive = []
  for(pl in this.players){
    if(this.players[pl].alive){
      alive.push(pl)
    }
  }
  if(alive.length === 0){
    this.endGame("draw")
  } else if(Object.keys(this.players).length > 1 && alive.length === 1){
    this.endGame(alive[0])
  }
}

exports.Game.prototype.removeDC = function(){
  var pl
  for(pl in this.players){
    if (!this.players[pl].connected){
      delete this.players[pl]
    }
  }
}

exports.Game.prototype.endGame = function(option){
  clearInterval(this.mainLoop)
  if(option === "draw"){
    this.broadcast(this, {code: "draw"})
  } else {
    this.broadcast(this, {code: "win", playerID: option})
  }
  // Remove disconnected players
  setTimeout(function(){
    this.reset()
    this.start()
  }.bind(this), 5000)
}
