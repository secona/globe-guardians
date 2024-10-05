import { Input, Scene, Physics, GameObjects } from "phaser";
import { Player } from "../sprites/player";

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private colliders!: Physics.Arcade.StaticGroup;
  private sandArea!: GameObjects.Polygon;
  private nanemSprite!: GameObjects.TileSprite;
  private sandShape!: Phaser.Geom.Polygon;

  constructor() {
    super("Game");
  }

  init() {}

  preload() {
    this.load.path = "assets/";
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 35,
      frameHeight: 48,
    });
    this.load.image("bg", "farm.png");
    this.load.image("nanem", "nanem.png");
  }

  create() {
    this.scene.start("HUD");
    const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, bg.width, bg.height);

    this.player = new Player({
      scene: this,
      x: 300,
      y: 400,
      texture: "farmer",
    });

    this.cursors = this.input.keyboard?.addKeys({
      up: Input.Keyboard.KeyCodes.W,
      left: Input.Keyboard.KeyCodes.A,
      down: Input.Keyboard.KeyCodes.S,
      right: Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;

    this.createColliders();
    this.physics.add.collider(this.player, this.colliders);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);
    this.cameras.main.setZoom(1.5);

    // Calculate bounds of the sand shape
    const bounds = this.calculatePolygonBounds(this.sandShape.points);

    // Create the nanem sprite (initially invisible)
    this.nanemSprite = this.add.tileSprite(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      "nanem"
    );
    this.nanemSprite.setOrigin(0, 0);
    this.nanemSprite.setVisible(false);
    this.nanemSprite.setDepth(1);

    // Create a mask for the nanem sprite
    const mask = this.make.graphics({});
    mask.fillStyle(0xffffff);
    mask.beginPath();
    mask.moveTo(this.sandShape.points[0].x, this.sandShape.points[0].y);
    for (let i = 1; i < this.sandShape.points.length; i++) {
      mask.lineTo(this.sandShape.points[i].x, this.sandShape.points[i].y);
    }
    mask.closePath();
    mask.fill();

    // Apply the mask to the nanem sprite
    this.nanemSprite.setMask(mask.createGeometryMask());

    // Add event listener for the Return key
    this.input.keyboard?.on("keydown-ENTER", this.changeSandTexture, this);
  }

  update() {
    if (this.player && this.cursors) {
      const direction = new Phaser.Math.Vector2(0, 0);
      direction.x = +this.cursors.right.isDown - +this.cursors.left.isDown;
      direction.y = +this.cursors.down.isDown - +this.cursors.up.isDown;
      direction.normalize();

      if (direction.x !== 0 || direction.y !== 0) {
        this.player.move(direction);
      } else {
        this.player.stopMoving();
      }
    }
  }

  private createColliders() {
    this.colliders = this.physics.add.staticGroup();
    this.colliders.add(
      this.add.rectangle(0, 0, 120, 120, 0x000000, 0).setOrigin(0, 0)
    );

    this.sandShape = new Phaser.Geom.Polygon([
      100, 100, 500, 100, 520, 150, 510, 200, 520, 250, 500, 300, 100, 300, 80,
      250, 90, 200, 80, 150,
    ]);

    this.sandArea = this.add.polygon(
      0,
      0,
      this.sandShape.points,
      0xc2b280,
      0.5
    );
    this.physics.add.existing(this.sandArea, true);
    this.colliders.add(this.sandArea);
  }

  private changeSandTexture() {
    if (this.player && this.sandArea) {
      const playerBounds = this.player.getBounds();
      const sandBounds = this.calculatePolygonBounds(this.sandShape.points);

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, sandBounds)
      ) {
        // Player is in the sand area, show the nanem texture
        this.nanemSprite.setVisible(true);
      }
    }
  }

  private calculatePolygonBounds(
    points: Phaser.Types.Math.Vector2Like[]
  ): Phaser.Geom.Rectangle {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return new Phaser.Geom.Rectangle(minX, minY, maxX - minX, maxY - minY);
  }
}
