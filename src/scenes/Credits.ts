import Phaser from "phaser";

export class Credits extends Phaser.Scene {
  private returnButton!: Phaser.GameObjects.Text;

  constructor() {
    super("Credits");
  }

  preload() {
    this.load.image("credits-bg", "assets/credits.png");
  }

  create() {
    this.add
      .image(0, 0, "credits-bg")
      .setOrigin(0, 0)
      .setDisplaySize(
        this.sys.game.config.width as number,
        this.sys.game.config.height as number
      );
    this.returnButton = this.add
      .text(20, 20, "Return to Main Menu", {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.returnToMainMenu());

    this.input!.keyboard!.on("keydown-ESC", () => this.returnToMainMenu());
  }

  private returnToMainMenu() {
    this.scene.start("MainMenu");
  }
}
