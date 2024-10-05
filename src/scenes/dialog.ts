import Phaser from "phaser";
import { Game } from "./Game";

export class DialogScene extends Phaser.Scene {
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
    super("DialogScene");
    this.dialogs = [
      {
        name: "JOKO",
        text: "Well, Ojan, here we are. This land has been in my family for generations. Here's the farmland I promised you.",
        character: "joko",
      },
      {
        name: "OJAN",
        text: "But Sir, why me? I think someone deserves this land better than I do.",
        character: "ojan",
      },
      {
        name: "JOKO",
        text: "Those whole days working with you, Ojan, I've seen your determination. I don't need someone who knows everything about farming right now. I need someone with the will to learn.",
        character: "joko",
      },
      {
        name: "JOKO",
        text: "I want someone like you to take on this land.",
        character: "joko",
      },
      {
        name: "OJAN",
        text: "Honestly, Mr. Joko, I... I don't know much about farming. I know that sounds strange. But I've always wanted to learn, and I want to do this right. I just need someone to show me the ropes.",
        character: "ojan",
      },
      {
        name: "JOKO",
        text: "Hmm. Well, I appreciate your honesty. Farming isn't easy—it takes patience, knowledge, and respect for the land. But you know, enthusiasm counts for a lot too. I can teach you some things, at least enough to get started.",
        character: "joko",
      },
    ];
  }

  preload() {
    this.load.image("ojan", "/assets/ojan.png");
  }

  create() {
    this.add.image(650, 300, "ojan");
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
      this.startMainMenu();
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

  private startMainMenu() {
    this.scene.start("Game");
  }
}
