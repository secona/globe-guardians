import { Scene } from "phaser";

export class Notification extends Phaser.GameObjects.Container {
  constructor(
    scene: Scene,
    private message: string,
    private linkText: string,
    private link: string,
  ) {
    super(scene, 600 / 2, 800 / 2);

    this.createModalBackground();
    this.createContentBackground();
    this.createTitle();
    this.createMessage();
    this.createButton();
    this.createExitButton();

    this.setDepth(1000);
    scene.add.existing(this);

    this.setSize(scene.scale.width, scene.scale.height);
    this.setInteractive();

    this.on(
      "pointerdown",
      (
        _pointer: Phaser.Input.Pointer,
        _localX: number,
        _localY: number,
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
    const message = this.scene.add
      .text(0, -10, this.message, {
        fontSize: "16px",
        color: "#B83C3C",
        align: "center",
      })
      .setOrigin(0.5);

    this.add(message);
    return message;
  }

  private createButton(): Phaser.GameObjects.Text {
    const button = this.scene.add
      .text(0, 50, this.linkText, {
        fontSize: "16px",
        color: "#FFF3C6",
        backgroundColor: "#B83C3C",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        window.open(this.link, "_blank");
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
