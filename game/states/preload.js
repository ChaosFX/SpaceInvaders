
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2, this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('invader0', 'assets/invader_00.png');
    this.load.image('invader1', 'assets/invader_01.png');

    this.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);

    this.load.audio('explosionSound', 'assets/explosion.wav');
    this.load.audio('shoot', 'assets/shoot.wav');
    this.load.audio('invaderKilledSound', 'assets/invaderkilled.wav');
    this.load.audio('introMusic', 'assets/Interstellar8bit.mp3');
    this.load.audio('music', 'assets/spaceinvaders1.mp3');

    this.load.bitmapFont('flappyfont', 'assets/flappyfont.png', 'assets/flappyfont.fnt');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
