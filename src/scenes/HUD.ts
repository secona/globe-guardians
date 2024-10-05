import { GameObjects, Scene } from "phaser";

export class HUD extends Scene {
    energyMask!: GameObjects.Sprite
    energyContainer!: GameObjects.Sprite
    energyContainerFilled!: GameObjects.Sprite

    energyValue: number = 100

    moneyBar!: GameObjects.Sprite;

    constructor() {
        super('HUD');
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("energy-container", "energy-container.png");
        this.load.image("energy-container-filled", "energy-container-filled.png");
        this.load.image("money-bar", "money-bar.png");
    }

    create() {
        this.moneyBar = this.add.sprite(0, 0, "money-bar").setOrigin(1, 0);
        this.moneyBar.setPosition(this.cameras.main.width - 10, 10);

        this.add.text(
            this.moneyBar.x - (this.moneyBar.width / 2) + 10,
            this.moneyBar.y + (this.moneyBar.height / 2),
            '20',
            {
                align: 'center',
                fontSize: 12,
                color: '#0D8D11',
            }
        ).setOrigin(0.5, 0.5);

        this.energyContainer = this.add.sprite(this.cameras.main.width, 0, "energy-container").setOrigin(1, 0);
        this.energyContainer.setPosition(this.cameras.main.width - 10, this.moneyBar.height + 15);

        this.energyContainerFilled = this.add.sprite(this.energyContainer.x, this.energyContainer.y, "energy-container-filled").setOrigin(1, 0);

        this.add.text(
            this.energyContainer.x - (this.energyContainer.width / 2) + 10,
            this.energyContainer.y + (this.energyContainer.height/ 2),
            '20 / 20',
            {
                align: 'center',
                fontSize: 12,
                color: '#1764DB',
            }
        ).setOrigin(0.5, 0.5);

        this.energyMask = this.add.sprite(this.energyContainer.x, this.energyContainer.y, "energy-container").setOrigin(1, 0);
        this.energyMask.visible = false;
        this.energyMask.x -= ((100 - this.energyValue) / 100) * this.energyMask.width;

        this.energyContainerFilled.mask = new Phaser.Display.Masks.BitmapMask(this, this.energyMask)
    }
}
