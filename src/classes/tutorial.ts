export class TutorialManager {
  private scene: Phaser.Scene;
  private overlay!: Phaser.GameObjects.Rectangle;
  private instructionText!: Phaser.GameObjects.Text;
  private nextButton!: Phaser.GameObjects.Text;
  private finishButton!: Phaser.GameObjects.Text;
  private currentStep: number = 0;
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  startTutorial() {
    this.isActive = true;
    this.createOverlay();
    this.createInstructionText();
    this.createNextButton();
    this.createFinishButton();
    this.showStep();
    this.disableGameInput();
  }

  private createOverlay() {
    this.overlay = this.scene.add.rectangle(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.7
    );
    this.overlay.setOrigin(0, 0);
    this.overlay.setDepth(1000);
  }

  private createInstructionText() {
    this.instructionText = this.scene.add.text(
      this.scene.scale.width / 2.6,
      this.scene.scale.height / 2 + 50,
      "",
      { fontSize: "24px", color: "#ffffff", align: "center" }
    );
    this.instructionText.setOrigin(0.5);
    this.instructionText.setDepth(1001);
  }

  private createNextButton() {
    this.nextButton = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      "Next",
      {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      }
    );
    this.nextButton.setOrigin(0.5);
    this.nextButton.setInteractive({ useHandCursor: true });
    this.nextButton.on("pointerdown", () => this.onNextButtonClick());
    this.nextButton.setDepth(1001);
  }

  private createFinishButton() {
    this.finishButton = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      "Finish",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      }
    );
    this.finishButton.setOrigin(0.5);
    this.finishButton.setInteractive({ useHandCursor: true });
    this.finishButton.on("pointerdown", () => this.endTutorial());
    this.finishButton.setDepth(1001);
    this.finishButton.setVisible(false);
  }

  private showStep() {
    const step = tutorialSteps[this.currentStep];
    this.instructionText.setText(step.text);

    if (this.currentStep === tutorialSteps.length - 1) {
      this.nextButton.setVisible(false);
      this.finishButton.setVisible(true);
    } else {
      this.nextButton.setVisible(true);
      this.finishButton.setVisible(false);
    }
  }

  private onNextButtonClick() {
    this.currentStep++;
    if (this.currentStep < tutorialSteps.length) {
      this.showStep();
    }
  }

  private endTutorial() {
    this.isActive = false;
    this.overlay.destroy();
    this.instructionText.destroy();
    this.nextButton.destroy();
    this.finishButton.destroy();
    this.enableGameInput();
    (this.scene as any).onTutorialComplete();
  }

  isRunning() {
    return this.isActive;
  }

  private disableGameInput() {
    if (this.scene.input.keyboard) {
      this.scene.input.keyboard.enabled = false;
    }
  }

  private enableGameInput() {
    if (this.scene.input.keyboard) {
      this.scene.input.keyboard.enabled = true;
    }
  }
}

const tutorialSteps = [
  { text: "Welcome to the Globe Guardians!\nPress 'Next' to continue." },
  { text: "Press '1' to select the shovel tool\n to know our soil fertility" },
  { text: "Press '2' to select nanti" },
  { text: "Press '3' to select axe\n to cut trees" },
  { text: "Press '4' to select lighter\n to burn peat" },
  { text: "Press '5' to select seed\n to plant crops" },
  { text: "Move to the soil area\n to plant crops" },
  {
    text: "Great job!\n You're ready to start playing.\nPress 'Finish' to begin.",
  },
];
