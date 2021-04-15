import Dungeon from './dungeon.js';
import Player from './player.js'

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#34343f',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        width: 400,
        height: 200,
        zoom: 3,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

const dungeon = new Dungeon();
const player = new Player();

function preload ()
{
    this.load.json('questions', 'questions.json');
    dungeon.preload(this);
    player.preload(this);
}

function create ()
{
    dungeon.create(this);
    player.create(this, 200 + dungeon.xOffset, 50 + dungeon.yOffset);
    this.physics.add.collider(player.sprite, dungeon.floor);
}

function update (t, dt)
{
    player.update(this, dt);
}