var Game = function() {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = { x: screen.canvas.width, y: screen.canvas.height };
  this.center = { x: this.size.x / 2, y: this.size.y / 2 };

  this.bodies = [new Player(this)];

  var self = this;
  function tick() {
    self.update();
    self.draw(screen);
    requestAnimationFrame(tick);
  }

  tick();
};

Game.prototype.update = function() {
  this.bodies.forEach(function(body){
    body.update();
  });
};

Game.prototype.draw = function(screen) {
  this.bodies.forEach(function(body){
    body.draw(screen);
  })
};

var drawBody = function(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2,
                  body.center.y - body.size.y / 2,
                  body.size.x,
                  body.size.y);
};

var Player = function(game){
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = { x: game.center.x, y: game.center.y - 15 };
};

Player.prototype.update = function() {

};

Player.prototype.draw = function(screen) {
  drawBody(screen, this);
};

window.addEventListener('load', function() {
  new Game();
});
