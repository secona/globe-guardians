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
        this.load.image("phosphorus-container", "phosphorus-container.png");
        this.load.image("phosphorus-container-filled", "phosphorus-container-filled.png");
        this.load.image("potassium-container", "potassium-container.png");
        this.load.image("potassium-container-filled", "potassium-container-filled.png");
        this.load.image("nitrate-container", "nitrate-container.png");
        this.load.image("nitrate-container-filled", "nitrate-container-filled.png");
        this.load.image("ph-container", "ph-container.png");
        this.load.image("ph-container-filled", "ph-container-filled.png");
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

        const phosphorus = this.makeElementBar("phosphorus", "Phosphorus", "#BD7042", 20 + this.moneyBar.width, 90);
        const potassium = this.makeElementBar("potassium", "Potassium", "#8868F1", 30 + this.moneyBar.width + phosphorus.width, 90);
        const nitrate = this.makeElementBar("nitrate", "Nitrate", "#B2AF00", 40 + this.moneyBar.width + phosphorus.width + potassium.width, 90);
        this.makeElementBar("ph", "pH", "#E54225", 50 + this.moneyBar.width + phosphorus.width + potassium.width + nitrate.width, 30);
    }

    makeElementBar(elementName: string, displayName: string, color: string, offsetX: number, value: number) {
        const container = this.add.sprite(this.cameras.main.width, 0, elementName + "-container").setOrigin(1, 0);
        container.setPosition(this.cameras.main.width - offsetX, 14);

        const containerFilled = this.add.sprite(container.x, container.y, elementName + "-container-filled").setOrigin(1, 0);

        this.add.text(
            container.x - (container.width / 2),
            container.y + (container.height / 2),
            displayName,
            {
                align: 'center',
                fontSize: 12,
                color,
            }
        ).setOrigin(0.5, 0.5);

        const containerMask = this.add.sprite(container.x, container.y, elementName + "-container").setOrigin(1, 0);
        containerMask.visible = false;
        containerMask.x -= ((100 - value) / 100) * containerMask.width;

        containerFilled.mask = new Phaser.Display.Masks.BitmapMask(this, containerMask)
        return container;
    }
}
