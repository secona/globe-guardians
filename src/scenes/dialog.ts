import Phaser from "phaser";

export interface Dialog {
  name: string;
  text: string;
  character: string;
}

export class DialogScene extends Phaser.Scene {
  private static TYPING_INTERVAL = 30;

  private dialogBox!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;

  private dialogs!: Dialog[];
  private currentDialogIndex: number = 0;
  private currentText: string = "";
  private textIndex: number = 0;

  constructor() {
    super("DialogScene");
  }

  init(data: { dialogs: Dialog[] }) {
    this.dialogs = data.dialogs;
  }

  preload() {
    this.load.image("ojan", "/assets/ojan.png");
  }

  create() {
    this.add.image(650, 300, "ojan");
    this.createDialogBox();

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      ?.on("down", this.showNextDialog, this);

    this.time.addEvent({
      delay: DialogScene.TYPING_INTERVAL,
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
      this.startMainMenu();
    }
  }

  private typeText() {
    if (this.textIndex < this.currentText.length) {
      this.dialogText.appendText(this.currentText[this.textIndex], false);
      this.textIndex++;
    }
  }

  private startMainMenu() {
    this.scene.start("Game");
  }
}
