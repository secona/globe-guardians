import { Input, Scene, Physics, GameObjects } from "phaser";
import { Player } from "../sprites/player";
import { ElementState } from "../states/ElementState";
import { ToolState } from "../states/ToolState";
import { Notification } from "../objects/modal";
import { StatsState } from "../states/StatsState";
import { TutorialManager } from "../classes/tutorial";

export class Farm extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private colliders!: Physics.Arcade.StaticGroup;
  private peat: Phaser.GameObjects.Image[] = [];
  private plantableArea!: Phaser.Geom.Rectangle;
  private plantedCrops: Phaser.GameObjects.Image[] = [];
  private plantedSawit: Phaser.GameObjects.Image[] = [];
  private tree: Phaser.GameObjects.Image[] = [];
  private notification: Notification | null = null;
  private isModalOpen: boolean = false;
  private cutTrees: Phaser.GameObjects.Image[] = [];
  private burningPeat: {
    peat: Phaser.GameObjects.Image;
    fire: Phaser.GameObjects.Sprite;
  }[] = [];

  private tutorialManager!: TutorialManager;

  private elementState: ElementState;
  private toolState: ToolState;
  private statsState: StatsState;

  constructor() {
    super("Farm");
    this.elementState = new ElementState();
    this.toolState = new ToolState();
    this.statsState = new StatsState();
  }

  init() {
    this.hud();
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
    this.load.image("pohon_kepotong", "pohon_kepotong.png");
    this.load.spritesheet("kebakaran", "kebakaran.gif", {
      frameWidth: 32,
      frameHeight: 32,
    });
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
          const peat = this.add
            .image(x + offsetX, y + offsetY, "peat")
            .setOrigin(0, 0);
          this.peat.push(peat);
        }
      }
    }

    this.player = new Player({
      scene: this,
      x: 300,
      y: 400,
      texture: "farmer",
    });

    this.tutorialManager = new TutorialManager(this);
    this.tutorialManager.startTutorial();

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

    this.plantableArea = new Phaser.Geom.Rectangle(250, 250, 350, 260);

    this.player.setDepth(1);

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
      ?.on("down", () => {
        this.toolState.setSelectedTool(1);
        this.hud();
      });

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
      ?.on("down", () => {
        this.toolState.setSelectedTool(2);
        this.hud();
      });

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
      ?.on("down", () => {
        this.toolState.setSelectedTool(3);
        this.hud();
      });

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
      ?.on("down", () => {
        this.toolState.setSelectedTool(4);
        this.hud();
      });

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      ?.on("down", () => {
        this.handleSpace();
      })

    this.anims.create({
      key: "burn",
      frames: this.anims.generateFrameNumbers("kebakaran", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    if (this.burningPeat.length > 0) {
      this.elementState.decrementAll(this.burningPeat.length);
      this.hud();
    }

    if (this.statsState.getEnergy() <= 1) {
      this.sleep();
      return;
    }

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
  }

  private handleSpace() {
    console.log(this.toolState.getSelectedTool())

    switch (this.toolState.getSelectedTool()) {
      case 1: this.tryPlant(); break;
      case 2: this.tryCutTree(); break;
      case 3: this.trySetPeatOnFire(); break;
      case 4: this.tryPlantSawit(); break;
    }
  }

  private tryCutTree() {
    if (!this.statsState.enoughForCutting()) {
      return;
    }

    const nearestTree = this.getNearestTree();
    if (nearestTree && this.isPlayerNearTree(nearestTree)) {
      const cutTree = this.add
        .image(nearestTree.x, nearestTree.y, "pohon_kepotong")
        .setOrigin(nearestTree.originX, nearestTree.originY)
        .setScale(nearestTree.scaleX, nearestTree.scaleY);

      this.tree = this.tree.filter((tree) => tree !== nearestTree);
      nearestTree.destroy();

      if (!this.cutTrees) {
        this.cutTrees = [];
      }

      this.cutTrees.push(cutTree);
      this.statsState.payForCutting();
      this.hud();

      console.log("Tree cut down!");
    } else {
      console.log("No tree to cut here!");
    }
  }

  private getNearestPeat(): Phaser.GameObjects.Image | null {
    let nearestPeat = null;
    let minDistance = Infinity;

    this.peat.forEach((peatObj) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        peatObj.x,
        peatObj.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestPeat = peatObj;
      }
    });

    return nearestPeat;
  }

  private isPlayerNearPeat(peat: Phaser.GameObjects.Image): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      peat.x,
      peat.y
    );
    return distance < 10;
  }

  private trySetPeatOnFire() {
    const nearestPeat = this.getNearestPeat();
    if (!this.statsState.enoughForBurning()) {
      return;
    }
    if (nearestPeat && this.isPlayerNearPeat(nearestPeat)) {
      console.log("Peat set on fire!");

      const fire = this.add
        .sprite(nearestPeat.x, nearestPeat.y, "kebakaran")
        .setOrigin(nearestPeat.originX, nearestPeat.originY)
        .setScale(nearestPeat.scaleX, nearestPeat.scaleY);

      fire.play("burn");

      nearestPeat.setTint(0xff6600);

      if (!this.burningPeat) {
        this.burningPeat = [];
      }

      this.burningPeat.push({ peat: nearestPeat, fire: fire });
      this.statsState.payForBurning();
      this.hud();

      this.peat = this.peat.filter((p) => p !== nearestPeat);
    } else {
      console.log("No peat nearby to set on fire!");
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
    this.notification = new Notification(
      this,
      "If you want to know how to\nactually be guardians of\nthe globe in real life,\npress the button below!",
      "Soil Fertility Protocol",
      "https://www.globe.gov/documents/352961/9e59d0d4-4cf5-4e62-9802-081a61442ef4"
    );
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

  private hud() {
    this.scene.launch("HUD", {
      elementState: this.elementState,
      toolState: this.toolState,
      statsState: this.statsState,
      sleep: this.sleep.bind(this),
    });
  }

  private sleep() {
    this.scene.pause("Farm");

    this.scene.launch("Dialog", {
      dialogs: [
        {
          name: "OJAN",
          text: "I think that's enough for today, time for a nap.",
          character: "ojan",
        },
      ],
      nextScene: 'City',
    });
  }
}
