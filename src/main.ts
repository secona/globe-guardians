import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        MainGame
    ]
};

export default new Game(config);
