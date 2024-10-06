import { Scene } from "phaser";
import { MainMenu } from "./MainMenu";

export class EndingScene extends Scene {
  private video!: Phaser.GameObjects.Video;

  constructor() {
    super("EndingScene");
  }

  preload() {
    this.load.video("ending", "assets/ending.mp4");
  }

  create() {
    const { width, height } = this.scale;

    this.video = this.add.video(width / 2, height / 2, "ending");

    const fitVideo = () => {
      const videoWidth = this.video.width;
      const videoHeight = this.video.height;

      const scaleX = width / videoWidth;
      const scaleY = height / videoHeight;

      const scale = Math.min(scaleX, scaleY);

      this.video.setDisplaySize(videoWidth * scale, videoHeight * scale);
    };

    this.video
      .play(false)
      .on("loadeddata", fitVideo)
      .on("complete", () => {
        this.scene.manager.getScenes().forEach((s) => this.scene.stop(s))
        this.scene.start("MainMenu")
      })
      .on("resize", fitVideo);
  }
}
