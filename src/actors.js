class Player extends Phaser.Sprite {
    constructor(game,name) {
        super(game,0,0,name);

        this.name = name; 

        this.x = 5;
        this.y = 450;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.collideWorldBounds = true;

        this.health = Invader.PLAYER_MAX_HEALTH;
        this.lives = Invader.PLAYER_INIT_LIVES;

        this.shotTimer = Invader.PLAYER_SHOT_LIMIT;
    }

    spawn() {
        this.game.add.existing(this);
    }

    changePlayerSpeed(x,y) {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
    }

    update() {
        this.shotTimer += 1;
        if(Invader.keylist.left.isDown) {
            this.body.velocity.x = -Invader.PLAYER_SPEED;
        }
        else if(Invader.keylist.right.isDown) {
            this.body.velocity.x = Invader.PLAYER_SPEED;
        } else {
            this.body.velocity.x = 0;
        }

        if(this.shotTimer >= 50 && Invader.keylist.space.isDown) {
            this.game.createBullet(this);
            this.shotTimer = 0;
        }
    }
};

class Bounds extends Phaser.TileSprite {
    constructor(game,name,lSide) {
        let x;
        x = lSide ? -25 : Invader.GAME_WIDTH - 7;
        super(game,x,0,32,Invader.GAME_HEIGHT,name);

        this.name = name;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.immovable = true;
        this.body.allowGravity = false;
    }

    spawn() {
        this.game.add.existing(this);
    }
};

class Wall extends Phaser.Sprite {
    constructor(game,name,num) {
        super(game,0,0,name);

        this.name = name;

        this.x = 40 + num * Invader.WALL_X_GAP;
        this.y = Invader.WALL_Y;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.immovable = true;
        this.body.allowGravity = false;

        this.health = Invader.MAX_WALL_HP;

        this.overcolor = [0xff2100,0xff4200,0xdd8810,0x00dddd];
        this.tint = this.overcolor[this.health];
    }

    spawn() {
        this.game.add.existing(this);
    }

    weaken() {
        this.health -= 1; 
        if(this.health == 0) {
            this.kill();
        } else {
            this.tint = this.overcolor[this.health];
        }
    }
};

class Enemy extends Phaser.Sprite {
    constructor(game,name) {
        super(game,0,0,name);

        this.name = name; 

        this.x = 32;
        this.y = 0;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.removeEnemy, this);

        this.hSpeed = 2;

        this.health = 1;

        this.shotTimer = 0;
    }

    spawn() {
        this.game.add.existing(this);
    }

    reverseHorizontal() {
        this.hSpeed *= -1;
    }

    progressVertical() {
        this.y += 32;
    }

    removeEnemy() {
        this.kill();
        this.game.score -= 10; // really, this shouldn't happen
    }

    update() {
        this.body.x += this.hSpeed;
    }
};

class FastEnemy extends Phaser.Sprite {
    constructor(game,name) {
        super(game,0,0,name);

        this.name = name; 

        this.x = 32;
        this.y = 0;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.removeEnemy, this);

        this.hSpeed = -3;

        this.health = 1;
    }

    spawn() {
        this.game.add.existing(this);
    }

    removeEnemy() {
        this.kill();
    }

    update() {
        this.body.x += this.hSpeed;
    }
};

class Bullet extends Phaser.Sprite {
    constructor(game,name,src) {
        super(game,0,0,name);
        this.name = name;
        this.source = src.name;

        this.x = src.x + 16;
        this.y = src.y;

        this.game.physics.arcade.enable(this);
        this.body.velocity.x = 0;

        this.body.velocity.y = src.name === 'player' ? -Invader.BULLET_SPEED : Invader.BULLET_SPEED;

        this.anchor.setTo(0.5,0.5);

        if (src.name === 'player') {
            this.tint = 0xffff00;
        } else {
            this.tint = 0xff0184;
            this.angle += 180;
        }


        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.removeBullet, this);
    }

    spawn() {
        this.game.add.existing(this);
    }

    removeBullet() {
        this.kill();
    }
};
