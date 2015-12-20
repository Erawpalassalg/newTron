function Player(options){
  this.bikeColor = options.bikeColor;
  this.id = options.id;
  this.direction = options.direction;
  this.x = options.x;
  this.y = options.y;
  this.sprites = {
    up: undefined,
    down: undefined,
    left: undefined,
    right: undefined,
    explode: undefined
  };
  var spr, dir, img;
  for(spr in this.sprites){
    switch(spr){
      case "explode":
        img = "/images/KABOUM!.png";
        dir = "none";
        break;
      default:
        console.log("/images/" + this.bikeColor + "_" + spr + ".png")
        img = "/images/" + this.bikeColor + "_" + spr + ".png"
        dir = spr;
    }
    this.sprites[spr] = new Sprite({
      color: this.bikeColor,
      player: this,
      direction: dir,
      img: img
    })
  }
  this.ghost = options.ghost;
  this.previousPlaces = [];
}

Player.prototype.update = function(receivedPlayerData){
  this.sprites[this.direction].clear();
  var difference_x = receivedPlayerData.x - this.x;
  var difference_y = receivedPlayerData.y - this.y;
  if(difference_x > 50 || difference_x < -50 || difference_y > 50 || difference_y < -50){
    this.sprites[this.direction].drawAllLines();
  } 
  this.direction = receivedPlayerData.direction;
  this.x = receivedPlayerData.x; 
  this.y = receivedPlayerData.y;
  this.sprites[this.direction].update();
  this.sprites[this.direction].draw();
}

//When a player dies
Player.prototype.laMuerta = function(){
  this.sprites[this.direction].clear();
  this.sprites.explode.update();
  this.sprites.explode.draw();
  setTimeout(function(){this.sprites.explode.clear()}.bind(this), 1250)
}

Player.prototype.reset = function(){
  this.previousPlaces = [];
}
