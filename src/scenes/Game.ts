import { Scene } from "phaser";
import { Player } from "../sprites/player";

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Game");
  }

  init() {
    console.log("Game scene initialized");
  }

  preload() {
    this.load.path = "assets/";
    console.log("Loading farmer sprite...");
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 35,
      frameHeight: 48,
    });
  }

  create() {
    console.log("Creating player...");
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: "farmer",
    });
    console.log("Player created", this.player);

    this.cursors = this.input.keyboard?.createCursorKeys()!;

    // Add any additional setup for your game scene here
    // For example, creating the world, adding other game objects, etc.
  }

  update() {
    if (this.player && this.cursors) {
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

    // Add any additional update logic for your game scene here
  }
}
