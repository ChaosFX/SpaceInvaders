(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'space-invaders');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('intro', require('./states/intro'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/intro":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){
'use strict';
  function Intro() {}
  Intro.prototype = {

    create: function () {

      this.introText = [
        'This fear is not real.',
        'The only place',
        'that fear can exist',
        'is in our thoughts of the future.',
        'It\'s a product of our imagination',
        'causing us to fear',
        'that do not at presant',
        'or may never exist.',
        'That is near insanity.',
        'Do not misunderstand me',
        'the danger is very real',
        'the fear is a choice.',
        ''
      ];

      this.introLabel = this.game.add.text(100, 100, '', { font: '24px Arial', fill: '#ffffff' });

      this.music = this.game.add.sound('introMusic').play();

      var index = -1;

      this.game.time.events.repeat(Phaser.Timer.SECOND * 6, 12, function () {
        index++;
        this.introLabel.setText(this.introText[index]);
      }, this);

      this.game.time.events.add(Phaser.Timer.SECOND * 78, function () {
        this.game.state.start('play');
      }, this).autoDestroy = true;
    },

    update: function () {

    },

    paused: function () {
      // This method will be called when game paused.
    },

    render: function () {
      // Put render operations here.
    },

    shutdown: function () {
      this.music.destroy();
      this.introLabel.destroy();
    }
  };
module.exports = Intro;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],6:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {

	    this.MAX_SPEED = 500;
	    this.ACCELERATION = 1500;
	    this.DRAG = 600;
	    this.SHOT_DELAY = 300;
	    this.BULLET_SPEED = 500;
	    this.NUMBER_OF_BULLETS = 3;

	    this.score = 0;
      this.vscore = 0;
	    this.highscore = 0;
	    this.lives = 3;

	    this.game.input.keyboard.addKeyCapture([
		    Phaser.Keyboard.LEFT,
		    Phaser.Keyboard.UP,
		    Phaser.Keyboard.RIGHT,
		    Phaser.Keyboard.DOWN,
		    Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.ESC
	    ]);

      this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

	    if (!!localStorage) {
				this.highscore = localStorage.getItem('highscore');

				if (!this.highscore || this.highscore < this.score) {
					this.highscore = this.score;
					localStorage.setItem('highscore', this.highscore);
				}
			} else {
				this.highscore = 'N/A';
			}

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.player = this.game.add.sprite(this.game.width / 2, this.game.height - 40, 'player');
      this.player.anchor.setTo(0.5, 0.5);
      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.body.maxVelocity.x = this.MAX_SPEED;
      this.player.body.drag.x = this.DRAG;
      this.player.body.bounce.x = 0.25;

      this.invaders;
      this.setupInvaders();

      this.bulletGroup = this.game.add.group();
      for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
      	var bullet = this.game.add.sprite(0, 0, 'bullet');
      	this.bulletGroup.add(bullet);
      	bullet.anchor.setTo(0.5, 0.5);
      	this.game.physics.arcade.enable(bullet);
      	bullet.kill();
      }

      this.bombGroup = this.game.add.group();
      for (var i = 0; i < 5; i++) {
        var bomb = this.game.add.sprite(0, 0, 'bomb0');
        this.bombGroup.add(bomb);
        bomb.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(bomb);
        bomb.kill();
      }

      this.explostionGroup = this.game.add.group();

      // this.game.add.sound('music', 1, true).play();

      this.game.time.advancedTiming = true;
      // this.fpsText = this.game.add.text(20, 20, '', { font: '16px Arial', fill: '#ffffff' });

      this.scoreText = this.game.add.bitmapText(20, 10, 'font', 'Score: ' + this.vscore);
      this.highScoreText = this.game.add.bitmapText(this.game.width / 2, 10, 'font', 'Highscore: ' + this.highscore);
      this.livesText = this.game.add.bitmapText(20, this.game.height - 30, 'font', 'Lives: ' + this.lives);

    },
    update: function() {
    	// this.fpsText.setText(this.game.time.fps + ' FPS');
      if (this.player.exists) {
        this.game.physics.arcade.overlap(this.invaders, this.player, this.gameOver, null, this);

        this.game.physics.arcade.overlap(this.bulletGroup, this.invaders, this.bulletHitsInvader, null, this);

        this.game.physics.arcade.overlap(this.bombGroup, this.player, this.bombHitsPlayer, null, this);

        this.playerInput();
        this.handleBombs();
        this.checkScore();
      }
    },

    bulletHitsInvader: function (bullet, invader) {
      this.score += invader.points;
      this.getExplosion(bullet.x, bullet.y);
      this.game.add.sound('invaderKilledSound').play();
      invader.kill();
      bullet.kill();

      if (this.invaders.countLiving() === 0) {
        this.game.time.events.add(Phaser.Timer.SECOND, this.nextWave, this);
      }
    },

    bombHitsPlayer: function (bomb, player) {
      this.getExplosion(player.x, player.y);
      this.game.add.sound('explosionSound').play();
      this.lives--;
      this.checkLives();
      player.kill();
      bomb.kill();

      if (this.lives > 0) {
        this.game.time.events.add(Phaser.Timer.SECOND / 2, this.respawnPlayer, this);
      } else {
        this.gameOver();
      }
    },

    checkLives: function () {
      this.livesText.setText('Lives: ' + this.lives);
    },

    checkScore: function () {
      if (this.score >= this.vscore) {
        this.scoreText.setText('Score: ' + this.vscore++);
      }
      if (this.score > this.highscore) {
        this.highscore = this.score;
        this.highScoreText.setText('Highscore: ' + this.highscore);
      }
    },

    respawnPlayer: function () {
      this.player.revive();
      this.player.reset(this.game.width / 2, this.game.height - 40);
    },

    newGame: function () {
      this.gameOverText.destroy();
      this.restartText.destroy();
      this.lives = 3;
      this.score = 0;
      this.vscore = 0;
      this.checkScore();
      this.checkLives();
      this.respawnPlayer();
      this.nextWave();
    },

    playerInput: function () {
	    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		    this.player.body.acceleration.x = -this.ACCELERATION;
	    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		    this.player.body.acceleration.x = this.ACCELERATION;
	    } else {
		    this.player.body.acceleration.x = 0;
	    }

	    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
	    	if (this.lastBulletShotAt === undefined) {
	    		this.lastBulletShotAt = 0;
	    	}
	    	if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) {
	    		return;
	    	}
	    	this.lastBulletShotAt = this.game.time.now;

	    	var bullet = this.bulletGroup.getFirstDead();
	    	if (bullet === null || bullet === undefined) {
	    		return;
	    	}
	    	this.game.add.sound('shoot').play();
	    	bullet.revive();
	    	bullet.checkWorldBounds = true;
	    	bullet.outOfBoundsKill = true;
	    	bullet.reset(this.player.x, this.player.y);
	    	bullet.body.velocity.y = -this.BULLET_SPEED;
	    }
    },

    getExplosion: function (x, y) {
    	var explosion = this.explostionGroup.getFirstDead();
    	if (explosion === null) {
    		explosion = this.game.add.sprite(0, 0, 'explosion');
    		explosion.anchor.setTo(0.5, 0.5);

    		var animation = explosion.animations.add('boom', [0, 1, 2, 3], 60, false);
    		animation.killOnComplete = true;

    		this.explostionGroup.add(explosion);
    	}

    	explosion.revive();
    	explosion.x = x;
    	explosion.y = y;

    	explosion.angle = this.game.rnd.integerInRange(0, 360);

    	explosion.animations.play('boom');

    	return explosion;
    },

    gameOver: function () {
    	this.player.kill();
      this.invaders.destroy();
      this.bulletGroup.callAll('kill');
      this.bombGroup.callAll('kill');

      this.gameOverText = this.game.add.bitmapText(this.game.width / 2 - 150,this.game.height / 2 - 50, 'font', 'GameOver', 50);
      // this.gameOverText.anchor.setTo(0.5, 0.5);
      this.restartText = this.game.add.bitmapText(this.game.width / 2 - 150, this.gameOverText.y + 50, 'font', 'Press ESC to restart', 24);
      // this.restartText.anchor.setTo(0.5, 0.5);

      this.restartKey.onDown.addOnce(this.newGame, this);
    },

    setupInvaders: function () {
    	this.invaders = this.game.add.group();
      this.invaders.y = 70;

      for (var y = 0; y < 6; y += 1) {
	      for (var x = 0; x < 10; x += 1) {
	      	var invader;

	      	if (y === 0 || y === 3) {
		     	  invader = this.game.add.sprite(x * 47, y * 47, 'invader2');
            invader.points = 30;
            invader.name = 'yellow';
	      	} else  if (y === 1 || y === 4) {
	          invader = this.game.add.sprite(x * 47, y * 47, 'invader1');
            invader.points = 20;
            invader.name = 'white';
	      	} else {
            invader = this.game.add.sprite(x * 47, y * 47, 'invader0');
            invader.points = 10;
            invader.name = 'blue';
          }

					invader.anchor.setTo(0.5, 0.5);
					this.game.physics.arcade.enable(invader);
					this.game.add.tween(invader).to({
					  y: invader.y + this.game.rnd.integerInRange(5, 10)
					}, 500, Phaser.Easing.Sinusoidal.InOut, true, this.game.rnd.integerInRange(0, 500), -1, true);
		      this.invaders.add(invader);
	      }
      }

      this.invadersMovement = this.game.add.tween(this.invaders)
      .to({
      	x: this.game.width - this.invaders.width
      }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
      .start();

      this.invadersMovement.onLoop.add(function () {
      	this.game.add.tween(this.invaders).to({
      	y: this.invaders.y + 10
      }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
    	}, this);
    },

    nextWave: function () {
    	this.invaders.removeAll();
    	this.setupInvaders();
    },

    handleBombs: function () {
      var alien = this.invaders.getAt(this.game.rnd.integerInRange(0, 60));
      if (!alien.exists) {
        return;
      }
      var bomb = this.bombGroup.getFirstDead();
      if (bomb === null || bomb === undefined) {
        return;
      }
      bomb.revive();
      if (alien.name === 'blue') {
        bomb.loadTexture('bomb0');
      } else if (alien.name === 'white') {
        bomb.loadTexture('bomb1');
      } else {
        bomb.loadTexture('bomb2');
      }
      bomb.reset(alien.x + this.invaders.x, alien.y + this.invaders.y);
      bomb.body.velocity.y = 300;
      bomb.checkWorldBounds = true;
      bomb.outOfBoundsKill = true;
    }
  };

  module.exports = Play;
},{}],7:[function(require,module,exports){

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
    this.load.image('invader2', 'assets/invader_02.png');
    this.load.image('bomb0', 'assets/bomb_00.png');
    this.load.image('bomb1', 'assets/bomb_01.png');
    this.load.image('bomb2', 'assets/bomb_02.png');

    this.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);

    this.load.audio('explosionSound', 'assets/explosion.wav');
    this.load.audio('shoot', 'assets/shoot.wav');
    this.load.audio('invaderKilledSound', 'assets/invaderkilled.wav');
    this.load.audio('introMusic', 'assets/Interstellar8bit.mp3');
    this.load.audio('music', 'assets/spaceinvaders1.mp3');

    this.load.bitmapFont('font', 'assets/pixelBitmap.png', 'assets/pixelBitmap.fnt');

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

},{}]},{},[1])