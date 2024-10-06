import Phaser from "phaser";

export interface IDialog {
  name: string;
  text: string;
  character: string;
}

export class Dialog extends Phaser.Scene {
  private static TYPING_INTERVAL = 30;

  private dialogBox!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;

  private currentDialogIndex: number = 0;
  private currentText: string = "";
  private textIndex: number = 0;

  private dialogs!: IDialog[];
  private nextScene!: string;

  constructor() {
    super("Dialog");
  }

  init(data: { dialogs: IDialog[], nextScene: string }) {
    this.dialogs = data.dialogs;
    this.nextScene = data.nextScene;
    this.currentDialogIndex = 0;
    this.currentText = "";
    this.textIndex = 0;
  }

  preload() {
    this.load.image("ojan", "/assets/ojan.png");
  }

  create() {
    this.scene.bringToTop(this);
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");

    this.add.image(650, 300, "ojan");
    this.createDialogBox();

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      ?.on("down", this.showNextDialog, this);

    this.time.addEvent({
      delay: Dialog.TYPING_INTERVAL,
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
    console.log(this.currentDialogIndex)
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
        this.scene.manager.getScenes().forEach((s) => this.scene.stop(s))
        this.scene.start(this.nextScene);
      })
    }
  }

  private typeText() {
    if (this.textIndex < this.currentText.length) {
      this.dialogText.appendText(this.currentText[this.textIndex], false);
      this.textIndex++;
    }
  }
}
