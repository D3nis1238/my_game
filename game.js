class Main extends Phaser.Scene {
    // This function essentially loads things into our game
    preload() {
      this.load.spritesheet("rocket", "assets/31-312092_nasa-spaceship-clipart-page-4-pics-about-space.png", {
        frameWidth: 98,
        frameHeight: 83,
      });
      this.load.image("meteorite", "assets/png-transparent-gray-asteroid-asteroid-sprite-asteroid-s-monochrome-rock-snout-thumbnail.png");
      this.load.audio("fly", "assets/kosmicheskaya-raketa-start-raketyi-29356.mp3");
    }

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {
      //Додаємо літак на сцену
      this.rocket = this.physics.add.sprite(0, 0, "rocket");
      //Масштабуємо літак
      this.rocket.setScale(0.65, 1);
      //Встановлюємо опорну точку літака
      this.rocket.setOrigin(0, 0.5);
      this.anims.create({
        key: "rocketAnimation",
        frames: this.anims.generateFrameNumbers("rocket", {
          frames: [0, 1, 3, 2],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.rocket.play("rocketAnimation");

      this.rocket.body.gravity.y = 1000;
      this.spaceBar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      this.score = 0;
      this.labelScore = this.add.text(20, 20, "0", {
        fontSize: 24,
        color: "black",
      });
      this.meteorites = this.physics.add.group();

      this.timedEvent = this.time.addEvent({
        delay: 1500,
        callback: this.addRowOfMeteorites, //Цю функцію реалізуємо на наступному кроці
        callbackScope: this,
        loop: true,
      });
      this.physics.add.overlap(this.rocket, this.meteorites, this.hitMeteorite, null, this);
    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
      if (this.rocket.angle < 20) {
        this.rocket.angle += 1;
      }

      if (this.rocket.y < 0 || this.rocket.y > 490) {
        this.scene.restart();
      }
      if (this.spaceBar.isDown) {
        this.fly();
      }
    }

    fly() {
      this.tweens.add({
        targets: this.rocket,
        angle: -20,
        duration: 100,
        repeat: 1,
      });
      this.rocket.body.velocity.y = -350;
    }

    //Функція для створення блоку труби
    addOnemeteorite(x, y) {
      var meteorite = this.physics.add.sprite(x, y, "meteorite");
      meteorite.setOrigin(0, 0);
      this.meteorites.add(pipe);
      meteorite.body.velocity.x = -300;

      meteorite.collideWorldBounds = true;
      meteorite.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfmeteorites() {
      var hole = Math.floor(Math.random() * 5) + 1;
      this.score += 1;
      this.labelScore.text = this.score;
      for (var i = 0; i < 8; i++) {
        if (!(i >= hole && i <= hole + 2)) this.addOnemeteorite(400, i * 60 + 10);
      }
    }
    hitmeteorite() {
      if (this.rocket.alive == false) return;

      this.timedEvent.remove(false);
      this.rocket.alive = false;

      this.meteorites.children.each(function (meteorite) {
        meteorite.body.velocity.x = 0;
      });
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: "#71c5cf",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
  };

  const game = new Phaser.Game(config);