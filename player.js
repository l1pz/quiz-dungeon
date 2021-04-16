export default class Player {
    constructor() {
        console.log("Player created!")
        this.animSpeeds = {
            'walk': 15,
            'idle': 10,
            'hurt': 15,
            'turn': 25
        }
        this.walkSpeed = 5;
        this.xVel = 0;
        this.yVel = 0;
        this.lookDirSM = new StateMachine({
            init: 'lookingLeft',
            transitions: [
                { name: 'lookLeft', from: 'lookingRight', to: 'lookingLeft' },
                { name: 'lookRight', from: 'lookingLeft', to: 'lookingRight' },
            ],
            methods: {
                onInvalidTransition: function (transition, from, to) {

                }
            }
        });
        this.animSM = new StateMachine({
            init: 'idlingLeft',
            transitions: [
                { name: 'walkLeft', from: ['idlingLeft', 'turningLeft'], to: 'walkingLeft' },
                { name: 'walkRight', from: ['idlingRight', 'turningRight'], to: 'walkingRight' },
                { name: 'turnLeft', from: ['idlingRight', 'walkingRight'], to: 'turningLeft' },
                { name: 'turnRight', from: ['idlingLeft', 'walkingLeft'], to: 'turningRight' },
                { name: 'idleLeft', from: ['walkingLeft', 'turningLeft'], to: 'idlingLeft' },
                { name: 'idleRight', from: ['walkingRight', 'turningRight'], to: 'idlingRight' },
            ],
            methods: {
                onInvalidTransition: function (transition, from, to) {

                }
            }

        });
    }

    preload(phaser) {
        phaser.load.atlas('player', 'sprites/player/player.png', 'sprites/player/player.json');
        this.input = phaser.input.keyboard.createCursorKeys();
    }

    create(phaser, x, y) {
        this.xDefault = x;
        this.yDefault = y;
        this.sprite = phaser.physics.add.sprite(x, y);
        this.sprite.body.setSize(12, 16);
        this.sprite.body.setOffset(6, 8);
        this.createAnims(phaser);
        this.animSM.observe({
            onTurningRight: () => { this.sprite.anims.play('player-left-turn'); },
            onLeaveTurningRight: () => { if (this.sprite.anims.isPlaying) return false; },
            onTurningLeft: () => { this.sprite.anims.play('player-right-turn'); },
            onLeaveTurningLeft: () => { if (this.sprite.anims.isPlaying) return false; },
            onWalkingRight: () => { this.sprite.anims.play('player-right-walk'); },
            onWalkingLeft: () => { this.sprite.anims.play('player-left-walk'); },
            onIdlingRight: () => { this.sprite.anims.play('player-right-idle'); },
            onIdlingLeft: () => { this.sprite.anims.play('player-left-idle'); },
        });
        this.sprite.anims.play('player-left-idle');
    }

    update(phaser, dt) {
        this.calculateVelocities();
        this.handleAnimations();
        this.move(dt);
        //console.log(this.animSM.state);
    }

    resetPosition() {
        this.sprite.setPosition(this.xDefault, this.yDefault);
    }

    handleAnimations() {
        if (this.xVel == 0 && this.yVel == 0) {

            if (this.lookDirSM.state == 'lookingLeft') {
                this.animSM.idleLeft();
            }
            else {
                this.animSM.idleRight();
            }
        }
        else {
            if (this.xVel > 0) {
                if (this.lookDirSM.state == 'lookingLeft') {
                    this.animSM.turnRight();
                }
                else {
                    this.animSM.walkRight();
                }
                this.lookDirSM.lookRight();
            }
            else if (this.xVel < 0) {
                if (this.lookDirSM.state == 'lookingRight') {
                    this.animSM.turnLeft();
                }
                else {
                    this.animSM.walkLeft();
                }
                this.lookDirSM.lookLeft();
            }
            else {
                if (this.lookDirSM.state == 'lookingRight') {
                    this.animSM.walkRight();
                }
                else {
                    this.animSM.walkLeft();
                }
            }
        }
    }

    calculateVelocities() {
        this.xVel = 0; this.yVel = 0;

        if (this.input.left.isDown) this.xVel -= this.walkSpeed;
        if (this.input.right.isDown) this.xVel += this.walkSpeed;
        if (this.input.up.isDown) this.yVel -= this.walkSpeed;
        if (this.input.down.isDown) this.yVel += this.walkSpeed;

        this.xVel = Math.min(Math.max(this.xVel, -this.walkSpeed), this.walkSpeed);
        this.yVel = Math.min(Math.max(this.yVel, -this.walkSpeed), this.walkSpeed);

        if (this.xVel !== 0 && this.yVel !== 0) {
            this.xVel *= 0.70710678118;
            this.yVel *= 0.70710678118;
        }
    }

    move(dt) {
        this.sprite.setVelocity(this.xVel * dt, this.yVel * dt);
    }

    createAnims(phaser) {
        phaser.anims.create({
            key: 'player-left-walk',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'lWalkRun_', suffix: '.png' }),
            repeat: -1,
            frameRate: this.animSpeeds.walk
        });
        phaser.anims.create({
            key: 'player-right-walk',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'rWalkRun_', suffix: '.png' }),
            repeat: -1,
            frameRate: this.animSpeeds.walk
        });
        phaser.anims.create({
            key: 'player-left-hurt',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'lHurt_', suffix: '.png' }),
            repeat: 3,
            frameRate: this.animSpeeds.hurt
        });
        phaser.anims.create({
            key: 'player-right-hurt',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'rHurt_', suffix: '.png' }),
            repeat: 3,
            frameRate: this.animSpeeds.hurt
        });
        phaser.anims.create({
            key: 'player-left-turn',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'lTurn_', suffix: '.png' }),
            repeat: 0,
            frameRate: this.animSpeeds.turn
        });
        phaser.anims.create({
            key: 'player-right-turn',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'rTurn_', suffix: '.png' }),
            repeat: 0,
            frameRate: this.animSpeeds.turn
        });
        phaser.anims.create({
            key: 'player-left-idle',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'lIdle_', suffix: '.png' }),
            repeat: -1,
            frameRate: this.animSpeeds.idle
        });
        phaser.anims.create({
            key: 'player-right-idle',
            frames: phaser.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'rIdle_', suffix: '.png' }),
            repeat: -1,
            frameRate: this.animSpeeds.idle
        });
    }
}