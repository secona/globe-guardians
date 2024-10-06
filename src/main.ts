import { Farm } from "./scenes/Farm";
import { AUTO, Game, Scale, Types } from "phaser";
import { HUD } from "./scenes/HUD";
import { MainMenu } from "./scenes/MainMenu";
import { Dialog } from "./scenes/Dialog";
import { City, CityHUD } from "./scenes/City";
import { SecondDialog } from "./scenes/SecondDialog";
import { EndingScene } from "./scenes/EndingScene";
import { BeforeCityDialog } from "./scenes/BeforeCityDialog";
import { Credits } from "./scenes/Credits";

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
  scene: [
    MainMenu,
    Credits,
    Dialog,
    Farm,
    HUD,
    BeforeCityDialog,
    City,
    CityHUD,
    SecondDialog,
    EndingScene,
  ],
};

export default new Game(config);
