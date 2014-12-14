
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
	    this.highscore = 0;
	    this.lives = 3;

	    this.game.input.keyboard.addKeyCapture([
		    Phaser.Keyboard.LEFT,
		    Phaser.Keyboard.UP,
		    Phaser.Keyboard.RIGHT,
		    Phaser.Keyboard.DOWN,
		    Phaser.Keyboard.SPACEBAR
	    ]);

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

      this.player = this.game.add.sprite(this.game.width / 2, this.game.height - 32, 'player');
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

      this.explostionGroup = this.game.add.group();

      this.game.add.sound('music', 1, true).play();

      this.game.time.advancedTiming = true;
      this.fpsText = this.game.add.text(20, 20, '', { font: '16px Arial', fill: '#ffffff' });

      this.scoreText = this.game.add.bitmapText(20, 20, 'flappyfont', 'Score: ' + this.score);
      this.highScoreText = this.game.add.bitmapText(this.game.width / 2, 20, 'flappyfont', 'Highscore: ' + this.highscore);

    },
    update: function() {
    	this.fpsText.setText(this.game.time.fps + ' FPS');
    	this.scoreText.setText('Score: ' + this.score);
    	if (this.score > this.highscore) {
    		this.highscore = this.score;
    		this.highScoreText.setText('Highscore: ' + this.highscore);
    	}

	    this.game.physics.arcade.collide(this.player, this.invaders, this.gameOver, null, this);

	    this.game.physics.arcade.overlap(this.bulletGroup, this.invaders, function (bullet, invader) {
	    	this.getExplosion(bullet.x, bullet.y);
	    	this.game.add.sound('invaderKilledSound').play();
	    	invader.kill();
	    	bullet.kill();
	    	this.score += 10;
	    	if (this.invaders.countLiving() == 0) {
	    		this.nextWave();
	    	}
	    }, null, this);

	    this.playerInput();

	    if (this.invaders.height > this.game.height) {
	    	this.gameOver();
	    }

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
    	this.player.reset(this.game.width / 2, this.game.height - 32);
    	this.nextWave();
    },

    setupInvaders: function () {
    	this.invaders = this.game.add.group();

    	var invaderType = true;
      for (var y = 0; y < 252; y += 42) {
      	invaderType = !invaderType;
	      for (var x = 0; x < 470; x += 47) {
	      	var invader;
	      	if (invaderType) {
		     	 invader = this.game.add.sprite(x, y, 'invader0');
	      	} else {
	         invader = this.game.add.sprite(x, y, 'invader1');

	      	}

					invader.anchor.setTo(0.5, 0.5);
					this.game.physics.arcade.enable(invader);
					this.game.add.tween(invader).to({
					  y: y + this.game.rnd.integerInRange(5, 10)
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
    }
  };

  module.exports = Play;