import Phaser from "phaser";

export class SecondDialog extends Phaser.Scene {
  private static TYPING_INTERVAL = 30;
  private dialogBox!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;
  private currentDialogIndex: number = 0;
  private currentText: string = "";
  private textIndex: number = 0;
  private dialogs: { name: string; text: string; character: string }[];
  private nextScene: string = "YourNextSceneKey";

  constructor() {
    super("SecondDialog");
    this.dialogs = [
      {
        name: "SYSTEM",
        text: "(School bell rings)",
        character: "system",
      },
      {
        name: "SURYA",
        text: "That was close, I've got to get better at waking up on time. Otherwise, teacher's going to be angrier than ever.",
        character: "surya",
      },
      {
        name: "SYSTEM",
        text: "Surya goes home and took a big rest, although being late the day seems to be just fine.",
        character: "system",
      },
    ];
  }

  create() {
    this.scene.bringToTop(this);
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");
    this.createDialogBox();
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      ?.on("down", this.showNextDialog, this);
    this.time.addEvent({
      delay: SecondDialog.TYPING_INTERVAL,
      callback: this.typeText,
      callbackScope: this,
      loop: true,
    });
    this.showNextDialog();
  }

  private createDialogBox() {
    this.dialogBox = this.add
      .rectangle(400, 500, 780, 180, 0xfff2cc)
      .setStrokeStyle(4, 0xd2691e);
    this.nameText = this.add.text(20, 420, "", {
      fontSize: "24px",
      color: "#000",
    });
    this.dialogText = this.add.text(20, 460, "", {
      fontSize: "20px",
      color: "#000",
      wordWrap: { width: 760 },
    });
    this.continueText = this.add.text(720, 640, "[Continue]", {
      fontSize: "18px",
      color: "#666",
    });
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
      const dialog = this.dialogs[this.currentDialogIndex++];
      this.nameText.setText(dialog.name);
      this.dialogText.setText("");
      this.currentText = dialog.text;
      this.textIndex = 0;
      this.showDialog();
    } else {
      this.cameras.main.fade(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.manager.getScenes().forEach((s) => this.scene.stop(s));
        this.scene.start(this.nextScene);
      });
    }
  }

  private typeText() {
    if (this.textIndex < this.currentText.length) {
      this.dialogText.appendText(this.currentText[this.textIndex], false);
      this.textIndex++;
    }
  }
}
