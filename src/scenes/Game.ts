import { Input, Scene, Physics } from "phaser";
import { Player } from "../sprites/player";
import { ElementState } from "../states/ElementState";
import { ToolState } from "../states/ToolState";
import { Notification } from "../objects/modal";

export class Game extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private plantKey!: Phaser.Input.Keyboard.Key;
  private sawitKey!: Phaser.Input.Keyboard.Key;
  private colliders!: Physics.Arcade.StaticGroup;
  private plantableArea!: Phaser.Geom.Rectangle;
  private plantedCrops: Phaser.GameObjects.Image[] = [];
  private plantedSawit: Phaser.GameObjects.Image[] = [];
  private tree: Phaser.GameObjects.Image[] = [];
  private notification: Notification | null = null;
  private isModalOpen: boolean = false;

  private hudScene: Phaser.Scenes.ScenePlugin = null!;

  private elementState: ElementState;
  private toolState: ToolState;

  constructor() {
    super("Game");
    this.elementState = new ElementState();
    this.toolState = new ToolState();
  }

  init() {
    this.hudScene = this.scene.launch("HUD", {
      elementState: this.elementState,
    });
  }

  preload() {
    this.load.path = "assets/";
    this.load.spritesheet("farmer", "farmer.png", {
      frameWidth: 35,
      frameHeight: 48,
    });
    this.load.image("bg", "farm.png");
    this.load.image("nanem", "nanem.png");
    this.load.image("pohon", "pohon.png");
    this.load.image("peat", "peat.png");
    this.load.image("sawit", "sawit.png");
  }

  create() {
    const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, bg.width, bg.height);
    this.tree = [];

    const treeGridSize = 50;
    const treeAreaStartX = 600;
    const treeAreaStartY = 100;
    const treeAreaWidth = 250;
    const treeAreaHeight = 200;

    for (
      let x = treeAreaStartX;
      x < treeAreaStartX + treeAreaWidth;
      x += treeGridSize
    ) {
      for (
        let y = treeAreaStartY;
        y < treeAreaStartY + treeAreaHeight;
        y += treeGridSize
      ) {
        if (Math.random() < 0.7) {
          const offsetX = Math.random() * 20 - 10;
          const offsetY = Math.random() * 20 - 10;
          const tree = this.add
            .image(x + offsetX, y + offsetY, "pohon")
            .setOrigin(0, 0);
          this.tree.push(tree);
        }
      }
    }

    const peatGridSize = 30;
    const peatAreaStartX = 400;
    const peatAreaStartY = 80;
    const peatAreaWidth = 160;
    const peatAreaHeight = 80;

    for (
      let x = peatAreaStartX;
      x < peatAreaStartX + peatAreaWidth;
      x += peatGridSize
    ) {
      for (
        let y = peatAreaStartY;
        y < peatAreaStartY + peatAreaHeight;
        y += peatGridSize
      ) {
        if (Math.random() < 0.6) {
          const offsetX = Math.random() * 10 - 5;
          const offsetY = Math.random() * 10 - 5;
          this.add.image(x + offsetX, y + offsetY, "peat").setOrigin(0, 0);
        }
      }
    }

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

    this.plantKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.ONE!)!;

    this.sawitKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.TWO!)!;

    this.createColliders();
    this.physics.add.collider(this.player, this.colliders);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);
    this.cameras.main.setZoom(1.5);

    this.plantableArea = new Phaser.Geom.Rectangle(250, 250, 350, 260);

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
  }

  update() {
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

      if (Phaser.Input.Keyboard.JustDown(this.plantKey)) {
        this.hudScene.launch("HUD", { elementState: this.elementState });
        console.log(this.toolState.getSelectedTool());
        this.tryPlant();
      }

      if (this.toolState.getSelectedTool() === 3) {
        this.tryCutTree();
      }
      if (this.toolState.getSelectedTool() === 2) {
        this.handlePlanting();
      }
    }
  }

  private tryCutTree() {
    const nearestTree = this.getNearestTree();

    if (nearestTree && this.isPlayerNearTree(nearestTree)) {
      nearestTree.destroy();
      console.log("Tree cut down!");

      this.tree = this.tree.filter((tree) => tree !== nearestTree);
    } else {
      console.log("No tree to cut here!");
    }
  }

  private handlePlanting() {
    if (Phaser.Input.Keyboard.JustDown(this.sawitKey)) {
      this.tryPlantSawit();
    }
  }

  private getNearestTree(): Phaser.GameObjects.Image | null {
    let nearestTree = null;
    let minDistance = Infinity;

    this.tree.forEach((tree) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        tree.x,
        tree.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestTree = tree;
      }
    });

    return nearestTree;
  }

  private isPlayerNearTree(tree: Phaser.GameObjects.Image): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      tree.x,
      tree.y
    );
    return distance < 50;
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
      this.showNotification();
      console.log("Planted!");
    } else if (this.isSpotOccupied(this.player.x, this.player.y)) {
      console.log("This spot is already occupied!");
    } else {
      console.log("Cannot plant here!");
    }
  }

  private tryPlantSawit() {
    if (
      this.isPlayerOverPlantableArea() &&
      !this.isSpotOccupied(this.player.x, this.player.y)
    ) {
      const sawit = this.add
        .image(this.player.x, this.player.y, "sawit")
        .setOrigin(0.5, 1);
      this.plantedSawit.push(sawit);
      console.log("Sawit planted!");
    } else if (this.isSpotOccupied(this.player.x, this.player.y)) {
      console.log("This spot is already occupied!");
    } else {
      console.log("Cannot plant sawit here!");
    }
  }

  private showNotification() {
    this.isModalOpen = true;
    this.notification = new Notification(this);
    this.notification.on("closed", this.onNotificationClosed, this);
    this.disableGameInput();
  }

  private onNotificationClosed = () => {
    this.isModalOpen = false;
    this.notification = null;
    this.enableGameInput();
  };

  private disableGameInput() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false;
    }
    if (this.input.mouse) {
      this.input.mouse.enabled = true;
    }
  }

  private enableGameInput() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
    }
    if (this.input.mouse) {
      this.input.mouse.enabled = true;
    }
  }
}
