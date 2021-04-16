import Dungeon from './dungeon.js';
import Player from './player.js';
import QuestionManager from './questionManager.js'

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#353540',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        width: 400,
        height: 400,
        zoom: 2,
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

const dungeon = new Dungeon(0, 256);
const player = new Player();
const questionManager = new QuestionManager();

function preload() {
    questionManager.preload(this);
    dungeon.preload(this);
    player.preload(this);
}

function create() {
    dungeon.create(this);
    player.create(this, 200 + dungeon.xOffset, 50 + dungeon.yOffset);
    this.physics.add.collider(player.sprite, dungeon.floor);
    let index = 0;
    for (const door of dungeon.doors) {
        this.physics.add.overlap(player.sprite, door, (playerBody, door) => {
            player.resetPosition(this);
            questionManager.newQuestion();
            if (questionManager.questions[questionManager.questionIndex].correct == door.index) {
                this.cameras.main.flash('200');    
            }
            else {
                this.cameras.main.shake('200');
                player.playErrorSound();   
            }
        });
        index++;
    }
    questionManager.create(this);
}

function update(t, dt) {
    player.update(this, dt);
}