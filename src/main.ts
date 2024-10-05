import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Scale, Types } from "phaser";
import { HUD } from "./scenes/HUD";
import { MainMenu } from "./scenes/MainMenu";
import { DialogScene } from "./scenes/dialog";
import { ChangeScene } from "./scenes/changescene";
import { Secondscene } from "./scenes/Secondscene";

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [DialogScene, MainGame, HUD, ChangeScene, Secondscene],
};

export default new Game(config);
