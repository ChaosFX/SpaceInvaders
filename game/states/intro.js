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

      this.introLabel = this.game.add.bitmapText(100, 100, 'font', '');

      this.music = this.game.add.sound('introMusic').play();

      var index = -1;

      this.game.time.events.repeat(Phaser.Timer.SECOND * 6, 12, function () {
        index++;
        this.introLabel.setText(this.introText[index]);
      }, this);

      this.game.time.events.add(Phaser.Timer.SECOND * 86, function () {
        this.game.state.start('play');
      }, this).autoDestroy = true;

      this.skipText = this.game.add.bitmapText(this.game.width / 2 - 50, this.game.height - 20, 'font', '[Press ESC to skip]', 10);
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
      this.skipKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
      this.skipKey.onDown.addOnce(function () {
        this.game.state.start('play');
      }, this);
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
      this.skipText.destroy();
      this.game.input.keyboard.removeKey(Phaser.Keyboard.ESC);
    }
  };
module.exports = Intro;
