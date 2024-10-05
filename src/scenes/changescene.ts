import Phaser from "phaser";
import { Game } from "./Game";

export class ChangeScene extends Phaser.Scene {
  private dialogBox!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;
  private dialogs: { name: string; text: string; character: string }[];
  private currentDialogIndex: number = 0;
  private currentText: string = "";
  private textIndex: number = 0;
  private textSpeed: number = 3;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("ChangeScene");
    this.dialogs = [
      {
        name: "OJAN",
        text: "Alright-thats all for today, now have some rest on the condo i just built for you.",
        character: "ojan",
      },
    ];
  }

  preload() {
    this.load.image("ojan", "/assets/ojan.png");
  }

  create() {
    const ojanImage = this.add.image(650, 300, "ojan");
    ojanImage.setDepth(1000);

    this.createDialogBox();

    this.enterKey = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.enterKey.on("down", this.showNextDialog, this);

    this.showNextDialog();
  }

  private createDialogBox() {
    this.dialogBox = this.add.rectangle(400, 500, 780, 180, 0xfff2cc);
    this.dialogBox.setStrokeStyle(4, 0xd2691e);
    this.dialogBox.setDepth(1000);

    this.nameText = this.add.text(20, 420, "", {
      fontSize: "24px",
      color: "#000",
    });
    this.nameText.setDepth(1001);
    this.dialogText = this.add.text(20, 460, "", {
      fontSize: "20px",
      color: "#000",
      wordWrap: { width: 760 },
    });
    this.dialogText.setDepth(1001);
    this.continueText = this.add.text(720, 640, "[Continue]", {
      fontSize: "18px",
      color: "#666",
    });
    this.continueText.setDepth(1001);

    this.hideDialog();
  }

  private hideDialog() {
    this.dialogBox.setVisible(false);
    this.nameText.setVisible(false);
    this.dialogText.setVisible(false);
    this.continueText.setVisible(false);
  }

  private showDialog() {
    this.dialogBox.setVisible(true);
    this.nameText.setVisible(true);
    this.dialogText.setVisible(true);
    this.continueText.setVisible(true);
  }

  private showNextDialog() {
    if (this.currentDialogIndex < this.dialogs.length) {
      const dialog = this.dialogs[this.currentDialogIndex];
      this.nameText.setText(dialog.name);
      this.currentText = dialog.text;
      this.textIndex = 0;
      this.dialogText.setText("");
      this.showDialog();
      this.time.addEvent({
        delay: 100,
        callback: this.typeText,
        callbackScope: this,
        loop: true,
      });
      this.currentDialogIndex++;
    } else {
      this.hideDialog();
    }
  }

  private typeText() {
    if (this.textIndex < this.currentText.length) {
      this.dialogText.setText(
        this.dialogText.text + this.currentText[this.textIndex]
      );
      this.textIndex++;
    }
  }
}
