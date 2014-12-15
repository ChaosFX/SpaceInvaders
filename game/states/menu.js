
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function () {

  },

  create: function () {

    this.buttons = {
      pos: [-50, 50, 150],
      callbacks: [this.playState, this.howtoState, this.creditState]
    };

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.button1 = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 50, 'menuPlayButton', this.playState, this);
    this.button1.anchor.setTo(0.5, 0.5);

    this.button2 = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, 'menuHowtoButton', this.howtoState, this);
    this.button2.anchor.setTo(0.5, 0.5);

    this.button3 = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 150, 'menuCreditButton', this.creditState, this);
    this.button3.anchor.setTo(0.5, 0.5);

    this.arrow = this.game.add.image(this.game.world.centerX - 100, this.game.world.centerY - 50, 'menuArrow');
    this.arrow.anchor.setTo(0.5, 0.5);
    this.arrow.moveDelay = 100;
    this.arrow.canMove = true;
    this.arrow.currentButton = 1;

    this.game.add.tween(this.arrow)
    .to({
      x: this.arrow.x - 10
    }, 700, Phaser.Easing.Quadratic.Out)
    .to({
      x: this.arrow.x
    }, 400, Phaser.Easing.Quadratic.In)
    .loop().start();
  },

  playState: function () {
    this.game.state.start('intro');
  },

  howtoState: function () {

  },

  creditState: function () {

  },

  move: function () {
    if (this.cursors.down.isDown && this.arrow.canMove) {
      this.arrow.canMove = false;
      this.allowMovement();

      if (this.arrow.currentButton === 1) {
        this.tween(2);
      } else if (this.arrow.currentButton === 2) {
        this.tween(3);
      } else {
        this.tween(1);
      }
    }

    if (this.cursors.up.isDown && this.arrow.canMove) {
      this.arrow.canMove = false;
      this.allowMovement();

      if (this.arrow.currentButton === 1) {
        this.tween(3);
      } else if (this.arrow.currentButton === 2) {
        this.tween(1);
      } else {
        this.tween(2);
      }
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this.activateButton(this.arrow.currentButton);
    }
  },

  tween: function (buttonNum) {
    this.game.add.tween(this.arrow)
    .to({
      y: this.game.world.centerY + this.buttons.pos[buttonNum - 1]
    }, this.arrow.delay, Phaser.Easing.Quadratic.In)
    .start();
    this.arrow.currentButton = buttonNum;
  },

  allowMovement: function () {
    this.game.time.events.add(255, function () {
      this.arrow.canMove = true;
    }, this);
  },

  activateButton: function (currentButton) {
    this.buttons.callbacks[currentButton - 1].call(this);
  },

  update: function () {
    this.move();
  }
};

module.exports = Menu;
