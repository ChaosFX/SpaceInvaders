
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