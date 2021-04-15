export default class Player {
    constructor() {
        console.log("Player created!")
        this.animSpeeds = {
            'walk': 15,
            'idle': 10,
            'hurt': 15,
            'turn': 15
        }
        this.walkSpeed = 5;
        this.xVel = 0;
        this.yVel = 0;
        this.animSM = new StateMachine({
            init: 'leftIdle',
            transitions: [
                {name: 'turn', from: ['leftIdle', 'leftWalk'], to: 'rightTurn'},
                {name: 'turn', from: ['rightIdle', 'rightWalk'], to: 'leftTurn'},
                {name: 'walk', from: ['rightTurn', 'rightIdle', 'rightWalk'], to: 'rightWalk'},
                {name: 'walk', from: ['leftTurn', 'leftIdle', 'leftWalk'], to: 'leftWalk'},
                {name: 'idle', from: ['rightWalk', 'rightTurn'], to: 'rightIdle'},
                {name: 'idle', from: ['leftWalk', 'leftTurn'], to: 'leftIdle'},
            ],
        });
    }

    preload(phaser) {
        phaser.load.atlas('player', 'sprites/player/player.png', 'sprites/player/player.json');
        this.input = phaser.input.keyboard.createCursorKeys();
    }

    create(phaser, x, y) {
        this.sprite = phaser.physics.add.sprite(x, y);
        this.sprite.body.setSize(12, 16);
        this.sprite.body.setOffset(6, 8);
        this.createAnims(phaser);

        this.animSM.observe({
            onRightTurn: () => {this.sprite.anims.play('player-left-turn'); },
            onLeftTurn: () => {this.sprite.anims.play('player-right-turn'); },
            onRightWalk: () => {this.sprite.anims.play('player-right-walk'); },
            onLeftWalk: () => {this.sprite.anims.play('player-left-walk'); },
            onRightIdle: () => {this.sprite.anims.play('player-right-idle'); },
            onLeftIdle: () => {this.sprite.anims.play('player-left-idle'); },
        });
        this.sprite.anims.play('player-left-idle');
    }

    update(phaser, dt) {
        this.calculateVelocities();
        if(this.xVel == 0 && this.yVel == 0) {
            if(this.animSM.can('idle')) this.animSM.idle();
        }
        else {
            if(this.animSM.can('walk')) this.animSM.walk();
            else this.animSM.turn();
        }
        this.move(dt);
        console.log(this.animSM.state);
    }

    calculateVelocities() {
        this.xVel = 0; this.yVel = 0;

        if(this.input.left.isDown) this.xVel -= this.walkSpeed; 
        if(this.input.right.isDown) this.xVel += this.walkSpeed; 
        if(this.input.up.isDown) this.yVel -= this.walkSpeed; 
        if(this.input.down.isDown) this.yVel += this.walkSpeed; 

        this.xVel = Math.min(Math.max(this.xVel, -this.walkSpeed), this.walkSpeed);
        this.yVel = Math.min(Math.max(this.yVel, -this.walkSpeed), this.walkSpeed);

        if(this.xVel !== 0 && this.yVel !== 0) {
            this.xVel *= 0.70710678118;
            this.yVel *= 0.70710678118;
        }
    }

    move(dt) {
        this.sprite.setVelocity(this.xVel * dt, this.yVel *  dt);
    }

    createAnims(phaser) {
        phaser.anims.create({
            key: 'player-left-walk',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'lWalkRun_', suffix:'.png'}),
            repeat: -1,
            frameRate: this.animSpeeds.walk
        });
        phaser.anims.create({
            key: 'player-right-walk',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'rWalkRun_', suffix:'.png'}),
            repeat: -1,
            frameRate: this.animSpeeds.walk
        });
        phaser.anims.create({
            key: 'player-left-hurt',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'lHurt_', suffix:'.png'}),
            repeat: 3,
            frameRate: this.animSpeeds.hurt
        });
        phaser.anims.create({
            key: 'player-right-hurt',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'rHurt_', suffix:'.png'}),
            repeat: 3,
            frameRate: this.animSpeeds.hurt
        });
        phaser.anims.create({
            key: 'player-left-turn',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'lTurn_', suffix:'.png'}),
            repeat: 0,
            frameRate: this.animSpeeds.turn
        });
        phaser.anims.create({
            key: 'player-right-turn',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'rTurn_', suffix:'.png'}),
            repeat: 0,
            frameRate: this.animSpeeds.turn
        });
        phaser.anims.create({
            key: 'player-left-idle',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'lIdle_', suffix:'.png'}),
            repeat: -1,
            frameRate: this.animSpeeds.idle
        });
        phaser.anims.create({
            key: 'player-right-idle',
            frames: phaser.anims.generateFrameNames('player', {start: 0, end: 3, prefix:'rIdle_', suffix:'.png'}),
            repeat: -1,
            frameRate: this.animSpeeds.idle
        });
    }
}