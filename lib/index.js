var Game = function() {
  var screen = document.getElementById('screen').getContext('2d');

  var self = this;
  function tick() {
    self.update();
    self.draw(screen);
    requestAnimationFrame(tick);
  }

  tick();
};

Game.prototype.update = function() {

};

Game.prototype.draw = function(screen) {
  
};

window.addEventListener('load', function() {
  new Game();
});
