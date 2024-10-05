import Phaser from "phaser";

interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private config: PlayerConfig;
  declare body: Phaser.Physics.Arcade.Body;
  private moveSpeed: number = 200;

  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.texture, config.frame);
    this.config = config;
    this.init();
  }

  init(): void {
    const { scene } = this.config;
    console.log("Initializing Player in Scene", scene);

    if (!scene) {
      console.error("Scene is undefined");
      return;
    }

    if (!scene.add || typeof scene.add.existing !== "function") {
      console.error("Scene add system not available or not a function");
      return;
    }

    if (!scene.physics || typeof scene.physics.add.existing !== "function") {
      console.error("Scene physics system not available or not a function");
      return;
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body) {
      this.body.setCollideWorldBounds(true);
      this.body.allowGravity = false;
    } else {
      console.error("Player body not initialized");
    }

    this.setAnimations();
  }

  private setAnimations(): void {
    const { scene } = this.config;
    const createAnimation = (key: string, frames: number[]) => {
      if (!scene.anims.exists(key)) {
        scene.anims.create({
          key: key,
          frames: scene.anims.generateFrameNumbers("farmer", {
            frames: frames,
          }),
          frameRate: 6,
          yoyo: true,
          repeat: -1,
        });
      }
    };

    createAnimation("walking-down", [0, 0]);
    createAnimation("walking-up", [0, 1]);
    createAnimation("walking-right", [0, 3]);
    createAnimation("walking-left", [0, 2]);
  }

  move(direction: Phaser.Math.Vector2): void {
    if (this.body) {
      this.body.setVelocity(
        direction.x * this.moveSpeed,
        direction.y * this.moveSpeed
      );

      if (direction.x < 0) {
        this.play("walking-left", true);
      } else if (direction.x > 0) {
        this.play("walking-right", true);
      } else if (direction.y < 0) {
        this.play("walking-up", true);
      } else if (direction.y > 0) {
        this.play("walking-down", true);
      } else {
        this.stopMoving();
      }
    } else {
      console.error("Cannot move: Player body is null");
    }
  }

  stopMoving(): void {
    if (this.body) {
      this.body.setVelocity(0);
      this.stop();
      this.setFrame(0);
    } else {
      console.error("Cannot stop moving: Player body is null");
    }
  }
}
