import { Input, Scene, Physics } from "phaser";
import { Player } from "../sprites/player";
import { HUD } from "./HUD";

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private plantKey!: Phaser.Input.Keyboard.Key;
  private colliders!: Physics.Arcade.StaticGroup;
  private hudScene!: HUD;
  private plantableArea!: Phaser.Geom.Rectangle;
  private plantedCrops: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("Game");
  }

  init() {
    this.scene.launch("HUD");
    this.hudScene = this.scene.get("HUD") as HUD;
  }

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

    this.plantKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE)!;

    this.createColliders();
    this.physics.add.collider(this.player, this.colliders);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);
    this.cameras.main.setZoom(1.5);

    this.plantableArea = new Phaser.Geom.Rectangle(250, 250, 250, 260);

    this.player.setDepth(1);
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

      if (Phaser.Input.Keyboard.JustDown(this.plantKey)) {
        this.tryPlant();
      }
    }
  }

  private createColliders() {
    this.colliders = this.physics.add.staticGroup();
    this.colliders.add(
      this.add.rectangle(0, 0, 120, 120, 0x000000, 0).setOrigin(0, 0)
    );
  }

  private isPlayerOverPlantableArea(): boolean {
    return this.plantableArea.contains(this.player.x, this.player.y);
  }

  private isSpotOccupied(x: number, y: number): boolean {
    return this.plantedCrops.some(
      (crop) => Phaser.Math.Distance.Between(crop.x, crop.y, x, y) < 20
    );
  }

  private tryPlant() {
    if (
      this.isPlayerOverPlantableArea() &&
      !this.isSpotOccupied(this.player.x, this.player.y)
    ) {
      const crop = this.add
        .image(this.player.x, this.player.y, "nanem")
        .setOrigin(0.5, 1);
      this.plantedCrops.push(crop);
      console.log("Planted!");
    } else if (this.isSpotOccupied(this.player.x, this.player.y)) {
      console.log("This spot is already occupied!");
    } else {
      console.log("Cannot plant here!");
    }
  }
}
