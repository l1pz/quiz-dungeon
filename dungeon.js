export default class Dungeon {
    constructor() {
        this.xOffset = 0;
        this.yOffset = 100;
        this.floor = null;
        console.log("Dungeon created!")
    }

    preload(phaser) {
        phaser.load.image('dungeon', 'tilemaps/dungeon.png');
        phaser.load.image('shadows', 'tilemaps/shadows.png');
        phaser.load.tilemapTiledJSON('tilemap', 'tilemaps/dungeon.json');
    }

    create(phaser) {
        const map = phaser.make.tilemap({key: 'tilemap'});

        const tileset = map.addTilesetImage('dungeon', 'dungeon');
        const shadows = map.addTilesetImage('shadows', 'shadows');
        this.floor = map.createLayer('Floor', tileset, this.xOffset, this.yOffset);
        
        map.createLayer('Carpet', tileset, this.xOffset, this.yOffset);
        map.createLayer('Shadows', shadows, this.xOffset, this.yOffset);
        
        this.floor.setCollisionByProperty({collides: true});
        /*const debugGraphics = phaser.add.graphics().setAlpha(0.7);
        this.floor.renderDebug(debugGraphics, {
            tileColor: null, 
            collidingTileColor: new Phaser.Display.Color(254, 200, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });*/
    }
}