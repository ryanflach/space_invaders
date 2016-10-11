var Game = function() {
  var screen = document.getElementById('screen').getContext('2d');
  this.size = { x: screen.canvas.width, y: screen.canvas.height };
  this.center = { x: this.size.x / 2, y: this.size.y / 2 };

  this.bodies = createInvaders(this).concat(new Player(this));

  var self = this;
  function tick() {
    self.update();
    self.draw(screen);
    window.requestAnimationFrame(tick);
  }

  tick();
};

Game.prototype.update = function() {
  var self = this;
  var notCollidingWithAnything = function(b1) {
    return self.bodies.filter(function(b2) {
      return isColliding(b1, b2);
    }).length === 0;
  };

  this.bodies = this.bodies.filter(notCollidingWithAnything)
  this.bodies.forEach(function(body){
    body.update();
  });
};

Game.prototype.draw = function(screen) {
  screen.clearRect(0, 0, this.size.x, this.size.y);
  this.bodies.forEach(function(body){
    body.draw(screen);
  })
};

Game.prototype.addBody = function(body) {
  this.bodies.push(body);
};

Game.prototype.invadersBelow = function(invader) {
  return this.bodies.filter(function(b) {
    return b instanceof Invader &&
      b.center.y > invader.center.y &&
      Math.abs(b.center.x - invader.center.x) < invader.size.x
  }).length > 0;
}

var drawBody = function(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2,
                  body.center.y - body.size.y / 2,
                  body.size.x,
                  body.size.y);
};

var Keyboarder = function() {
  var keyState = {};

  window.addEventListener("keydown", function(event){
    keyState[event.keyCode] = true;
  });

  window.addEventListener("keyup", function(event){
    keyState[event.keyCode] = false;
  });

  this.isDown = function(keyCode) {
    return keyState[keyCode];
  };

  this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
}

var isColliding = function(b1, b2) {
  return !(
    b1 === b2 ||
      b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
      b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
      b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
      b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2
  );
};

var Player = function(game){
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = { x: game.center.x, y: game.size.y - 15 };
  this.keyboarder = new Keyboarder();
};

Player.prototype.update = function() {
  var minX = this.size.x / 2;
  var maxX = this.game.size.x - this.size.x / 2;

  if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.center.x > minX) {
    this.center.x -= 2;
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.center.x < maxX) {
    this.center.x += 2;
  } else if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
    this.game.addBody(new Bullet(this.game,
                      { x: this.center.x, y: this.center.y - this.size.y },
                      { x: 0, y: -6 }));
  }
};

Player.prototype.draw = function(screen) {
  drawBody(screen, this);
};

var Invader = function(game, center){
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = center;
  this.patrolX = 0;
  this.speedX = 0.3;
};

Invader.prototype.update = function() {
  if (this.patrolX < 0 || this.patrolX > 40) {
    this.speedX = -this.speedX;
  }

  this.center.x += this.speedX;
  this.patrolX += this.speedX;

  if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
    this.game.addBody(new Bullet(this.game,
                                 { x: this.center.x, y: this.center.y + this.size.x },
                                 { x: 0, y: 3 }))
  }
};

Invader.prototype.draw = function(screen) {
  drawBody(screen, this);
};

var Bullet = function(game, center, velocity){
  this.game = game;
  this.size = { x: 3, y: 3 };
  this.center = center;
  this.velocity = velocity;
};

Bullet.prototype.update = function() {
  this.center.x += this.velocity.x;
  this.center.y += this.velocity.y;
};

Bullet.prototype.draw = function(screen) {
  drawBody(screen, this);
};

var createInvaders = function(game) {
  var invaders = [];
  for (var i = 0; i < 24; i++) {
    var x = 30 + i % 8 * 30;
    var y = 30 + i % 3 * 30;

    invaders.push(new Invader(game, { x: x, y: y }));
  }
  return invaders;
}

window.addEventListener('load', function() {
  new Game();
});
