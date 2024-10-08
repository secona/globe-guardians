import { GameObjects, Input, Scene } from "phaser";
import { MainMenuState } from "../states/MainMenuState";
import { first } from "../constants/dialogs";
import { Credits } from "./Credits";

export class MainMenu extends Scene {
  mainMenuState: MainMenuState;
  indicator1!: GameObjects.Sprite;
  indicator2!: GameObjects.Sprite;

  constructor() {
    super("MainMenu");
    this.mainMenuState = new MainMenuState();
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("main-menu", "main-menu.png");
    this.load.image("circle", "circle.png");
  }

  create() {
    this.add.image(0, 0, "main-menu").setOrigin(0, 0);
    this.indicator1 = this.add
      .sprite(0, 0, "circle")
      .setOrigin(0, 0)
      .setScale(0.5);
    this.indicator2 = this.add
      .sprite(0, 0, "circle")
      .setOrigin(0, 0)
      .setScale(0.5);

    const text = this.add.text(
      300,
      550,
      "Press W and S to go up and down.\nPress Enter to select.",
      {
        align: "center",
      }
    );
    text.setPosition(800 / 2 - text.width / 2, 600 - 50);

    this.input.keyboard
      ?.addKey(Input.Keyboard.KeyCodes.W)
      ?.on("down", () => this.mainMenuState.prev());

    this.input.keyboard
      ?.addKey(Input.Keyboard.KeyCodes.S)
      ?.on("down", () => this.mainMenuState.next());

    this.input.keyboard
      ?.addKey(Input.Keyboard.KeyCodes.ENTER)
      ?.on("down", () => this.handleSpace());
  }

  update() {
    this.indicator1.setPosition(125, 288 + this.mainMenuState.selected * 135);
    this.indicator2.setPosition(630, 288 + this.mainMenuState.selected * 135);
  }

  handleSpace() {
    if (this.mainMenuState.selected == 0) {
      this.scene.stop("MainMenu");

      this.scene.launch("Dialog", {
        dialogs: first,
        nextScene: "Farm",
      });
    } else if (this.mainMenuState.selected == 1) {
      this.scene.stop("MainMenu");
      this.scene.start("Credits");
    }
  }
}
