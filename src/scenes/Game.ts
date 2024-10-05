import { Input, Scene } from "phaser";
import { Player } from "../sprites/player";

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.path = "assets/";
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 35,
      frameHeight: 48,
    });
  }

  create() {
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: "farmer",
    });

    this.cursors = this.input.keyboard?.addKeys({
      up: Input.Keyboard.KeyCodes.W,
      left: Input.Keyboard.KeyCodes.A,
      down: Input.Keyboard.KeyCodes.S,
      right: Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  update() {
    if (this.player && this.cursors) {
      const direction = new Phaser.Math.Vector2(0, 0);

      direction.x = +this.cursors.right.isDown - 2 * +this.cursors.left.isDown;
      direction.y = +this.cursors.down.isDown - 2 * +this.cursors.up.isDown;
      direction.normalize();

      if (direction.x !== 0 || direction.y !== 0) {
        this.player.move(direction);
      } else {
        this.player.stopMoving();
      }
    }
  }
}
