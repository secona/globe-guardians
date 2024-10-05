import Phaser from "phaser";
import { Game } from "../scenes/Game";

export class DialogScene extends Phaser.Scene {
  private dialogBox!: Phaser.GameObjects.Image;
  private characterImage!: Phaser.GameObjects.Image;
  private nameText!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
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

  create() {
    this.dialogBox = this.add.image(400, 300, "dialog");
    this.characterImage = this.add.image(100, 300, "ojan");
    this.nameText = this.add.text(150, 250, "", { fontSize: "16px" });
    this.dialogText = this.add.text(150, 300, "", {
      fontSize: "16px",
      wordWrap: { width: 600 },
    });

    this.enterKey = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.enterKey.on("down", this.showNextDialog, this);

    this.showNextDialog();
  }

  showNextDialog() {
    if (this.currentDialogIndex < this.dialogs.length) {
      const dialog = this.dialogs[this.currentDialogIndex];
      this.nameText.setText(dialog.name);
      this.characterImage.setTexture(dialog.character);
      this.currentText = dialog.text;
      this.textIndex = 0;
      this.dialogText.setText("");
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

  typeText() {
    if (this.textIndex < this.currentText.length) {
      this.dialogText.setText(
        this.dialogText.text + this.currentText[this.textIndex]
      );
      this.textIndex++;
    }
  }

  startMainMenu() {
    this.scene.start("Game");
  }
}
