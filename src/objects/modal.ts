import { Scene } from "phaser";

export class Notification extends Phaser.GameObjects.Container {
  private modalBackground: Phaser.GameObjects.Rectangle;
  private contentBackground: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private messageText: Phaser.GameObjects.Text;
  private button: Phaser.GameObjects.Text;
  private exitButton: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    super(scene, scene.scale.width / 2, scene.scale.height / 2);

    this.modalBackground = this.createModalBackground();
    this.contentBackground = this.createContentBackground();
    this.titleText = this.createTitle();
    this.messageText = this.createMessage();
    this.button = this.createButton();
    this.exitButton = this.createExitButton();

    this.setDepth(1000);
    scene.add.existing(this);

    this.setSize(scene.scale.width, scene.scale.height);
    this.setInteractive();

    this.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        localX: number,
        localY: number,
        event: Phaser.Types.Input.EventData
      ) => {
        event.stopPropagation();
      }
    );
  }

  private createModalBackground(): Phaser.GameObjects.Rectangle {
    const bg = this.scene.add.rectangle(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.7
    );
    bg.setOrigin(0.5, 0.5);
    this.add(bg);
    return bg;
  }

  private createContentBackground(): Phaser.GameObjects.Rectangle {
    const bg = this.scene.add.rectangle(0, 0, 300, 200, 0xfff3c6);
    bg.setStrokeStyle(4, 0xc27f1a);
    this.add(bg);
    return bg;
  }

  private createTitle(): Phaser.GameObjects.Text {
    const title = this.scene.add.text(0, -70, "Notification", {
      fontSize: "24px",
      color: "#B83C3C",
      fontStyle: "bold",
    });
    title.setOrigin(0.5);
    this.add(title);
    return title;
  }

  private createMessage(): Phaser.GameObjects.Text {
    const message = this.scene.add.text(
      0,
      -10,
      "If you want to know how to\nactually be guardians of\nthe globe in real life,\npress the button below!",
      {
        fontSize: "16px",
        color: "#B83C3C",
        align: "center",
      }
    );
    message.setOrigin(0.5);
    this.add(message);
    return message;
  }

  private createButton(): Phaser.GameObjects.Text {
    const button = this.scene.add.text(0, 50, "Soil Fertility Protocol", {
      fontSize: "16px",
      color: "#FFF3C6",
      backgroundColor: "#B83C3C",
      padding: { x: 10, y: 5 },
    });
    button.setOrigin(0.5).setInteractive();

    button.on("pointerdown", () => {
      window.open(
        "https://www.globe.gov/documents/352961/9e59d0d4-4cf5-4e62-9802-081a61442ef4",
        "_blank"
      );
    });

    this.add(button);
    return button;
  }

  private createExitButton(): Phaser.GameObjects.Text {
    const exitBtn = this.scene.add.text(140, -90, "X", {
      fontSize: "20px",
      color: "#B83C3C",
      backgroundColor: "#FFFFFF",
      padding: { x: 5, y: 2 },
    });
    exitBtn.setOrigin(0.5).setInteractive();

    exitBtn.on("pointerdown", () => this.closeNotification());
    this.add(exitBtn);
    return exitBtn;
  }

  private closeNotification() {
    this.emit("closed");
    this.destroy();
  }
}
