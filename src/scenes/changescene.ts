import Phaser from "phaser";
import { Secondscene } from "./Secondscene";

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
    super({ key: "ChangeScene", active: false });
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
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");

    const ojanImage = this.add.image(650, 300, "ojan");
    ojanImage.setDepth(1);

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
    this.dialogBox.setDepth(2);

    this.nameText = this.add.text(20, 420, "", {
      fontSize: "24px",
      color: "#000",
    });
    this.nameText.setDepth(3);

    this.dialogText = this.add.text(20, 460, "", {
      fontSize: "20px",
      color: "#000",
      wordWrap: { width: 760 },
    });
    this.dialogText.setDepth(3);

    this.continueText = this.add.text(720, 640, "[Continue]", {
      fontSize: "18px",
      color: "#666",
    });
    this.continueText.setDepth(3);

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
      this.startFadeOut();
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

  private startFadeOut() {
    this.cameras.main.fade(1000, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      if (this.scene.get("Game") && this.scene.isActive("Game")) {
        this.scene.stop("Game");
      }

      if (this.scene.get("Secondscene")) {
        this.scene.start("Secondscene");
      } else {
        console.error(
          "SecondScene not found. Make sure it's properly added to your game configuration."
        );
      }
    });
  }
}
