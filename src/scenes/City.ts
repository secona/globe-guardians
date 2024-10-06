import { Input, Scene, Physics } from "phaser";
import { Player } from "../sprites/player";
import { ElementState } from "../states/ElementState";
import { ToolState } from "../states/ToolState";
import { StatsState } from "../states/StatsState";

export class City extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private colliders!: Physics.Arcade.StaticGroup;
  private isModalOpen: boolean = false;

  private elementState: ElementState;
  private toolState: ToolState;
  private statsState: StatsState;
  private trucks: Phaser.GameObjects.Image[] = [];
  private aerosol!: Phaser.GameObjects.Image;

  constructor() {
    super("City");
    this.elementState = new ElementState();
    this.toolState = new ToolState();
    this.statsState = new StatsState();
  }

  preload() {
    this.load.path = "assets/";
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 42,
      frameHeight: 48,
    });
    this.load.image("bg", "kota.png");
    this.load.image("truk", "truk.png");
    this.load.image("aerosol", "aerosol.png");
  }

  create() {
    this.trucks = [];
    const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, bg.width, bg.height);
    this.aerosol = this.add
      .image(20, 0, "aerosol")
      .setOrigin(0, 0)
      .setDepth(10);

    this.player = new Player({
      scene: this,
      x: 300,
      y: 400,
      texture: "farmer",
    });

    const truckGridSize = 50;
    const truckAreaStartX = 600;
    const truckAreaStartY = 100;
    const truckAreaWidth = 250;
    const truckAreaHeight = 200;

    for (
      let x = truckAreaStartX;
      x < truckAreaStartX + truckAreaWidth;
      x += truckGridSize
    ) {
      for (
        let y = truckAreaStartY;
        y < truckAreaStartY + truckAreaHeight;
        y += truckGridSize
      ) {
        if (Math.random() > 0.7) {
          const offsetX = Math.max(Math.random() * 800, 600);
          const offsetY = Math.min(
            Math.max(Math.random() * 400 + 100, 200),
            600
          );
          const tree = this.add.image(offsetX, offsetY, "truk").setOrigin(0, 0);
          this.trucks.push(tree);
        }
      }
    }

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

    this.player.setDepth(1);

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
      ?.on("down", () => this.toolState.setSelectedTool(1));
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
      ?.on("down", () => this.toolState.setSelectedTool(2));
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
      ?.on("down", () => this.toolState.setSelectedTool(3));
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
      ?.on("down", () => this.toolState.setSelectedTool(4));
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
      ?.on("down", () => this.toolState.setSelectedTool(5));

    const overlay = this.add
      .rectangle(
        0,
        0,
        this.physics.world.bounds.width,
        this.physics.world.bounds.height,
        0x343434,
        0.95
      )
      .setOrigin(0, 0)
      .setDepth(2);

    const vision = this.make.graphics({
      x: this.player.x,
      y: this.player.y,
    });

    vision.fillStyle(0x000000, 0.18);
    vision.beginPath();
    vision.arc(0, 0, 50, 0, Math.PI * 2, false);
    vision.fillPath();

    const mask = new Phaser.Display.Masks.BitmapMask(this, vision);
    mask.invertAlpha = true;
    overlay.setMask(mask);

    this.events.on("update", () => {
      vision.x = this.player.x;
      vision.y = this.player.y;
    });

    vision.setDepth(3);
  }

  update() {
    if (this.player.y > 435) {
      this.player.y = 435;
    }
    if (this.player.y < 150) {
      this.player.y = 150;
    }
    this.aerosol.x = this.player.x - 97;
    this.aerosol.y = this.player.y - 200;

    if (this.player && this.cursors && !this.isModalOpen) {
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

    const sample = Math.random();
    if (sample < 0.01 && this.trucks.length < 5) {
      const truck = this.add
        .image(
          this.player.x + 250,
          Math.min(
            Math.max(this.player.y + Math.random() * 200 - 100, 100),
            300
          ),
          "truk"
        )
        .setOrigin(0, 0);

      this.trucks.push(truck);
    }

    if (this.player.x == 6300) {
      this.win();
    }

    for (const truck of this.trucks) {
      if (
        truck.x >= this.player.x &&
        truck.x <= this.player.x + 42 &&
        truck.y >= this.player.y &&
        truck.y + 64 >= this.player.y
      ) {
        this.die();
      }
      truck.x -= 1.5;
      if (truck.x - this.player.x > 500 && sample < 0.5) {
        truck.x = this.player.x + 500;
        truck.y = Math.min(
          this.player.y + Math.max(Math.random() * 200 - 100, 100),
          300
        );
      }
    }
  }

  private createColliders() {
    this.colliders = this.physics.add.staticGroup();
    this.colliders.add(
      this.add.rectangle(0, 0, 120, 120, 0x000000, 0).setOrigin(0, 0)
    );
  }

  private die() {
    for (const truck of this.trucks) {
      truck.destroy();
    }
    this.trucks = [];
    this.player.x = 200;
    this.player.y = 400;
  }

  private win() {
    console.log("You win!");
  }
}
