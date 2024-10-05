import { Scene } from "phaser";
import { Player } from "../sprites/player";

interface PlayerAnims {
  pressedCursor: "up" | "down" | "left" | "right";
  actionAnimation: string;
}

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  init() {}

  preload() {
    this.load.path = "assets/";
    // Make sure to load your player sprite here
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: "farmer",
    });

    this.cursors = this.input?.keyboard?.createCursorKeys()!;
  }

  update() {
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown) {
      direction.x = -1;
    } else if (this.cursors.right.isDown) {
      direction.x = 1;
    }

    if (this.cursors.up.isDown) {
      direction.y = -1;
    } else if (this.cursors.down.isDown) {
      direction.y = 1;
    }

    if (direction.x !== 0 || direction.y !== 0) {
      direction.normalize();
      this.player.move(direction);
    } else {
      this.player.stopMoving();
    }
  }
}
