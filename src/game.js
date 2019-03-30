Invader.Game = function(game) {
    this.level = 0;

    this.player = null;

    this.fastEnemy = null;
    this.fastEnemyTimer = 0;
    this.fastEnemyAppear = 0;

    this.wallGroup = null;
    this.enemyGroup = null;
    this.bulletGroup = null;

    this.moveSwarm = null;
    this.shootSwarm = null;
    this.enemyShotTimer = 0;
    this.enemyShotBonus = 0;

    this.scoreText = null;
    this.score = 0;
    this.livesText = null;

    this.gameMusic = null;

    Invader.ENEMY_SCORE_BONUS = 50;
    Invader.SWARM_SCORE_BONUS = 500;
    Invader.FARAWAY_SCORE_BONUS = 100;
    Invader.FARAWAY_MIN = 2000;
    Invader.FARAWAY_MAX = 5000;

    Invader.PLAYER_MAX_HEALTH = 1;
    Invader.PLAYER_INIT_LIVES = 3;
    Invader.PLAYER_SPEED = 200;
    Invader.PLAYER_SHOT_LIMIT = 50;

    Invader.ENEMY_SHOT_LIMIT = 90;

    Invader.WALL_X_GAP = 200;
    Invader.WALL_Y = 400;
    Invader.MAX_WALL_HP = 3;

    Invader.BULLET_SPEED = 200;
};

Invader.Game.prototype = {
    create: function() {
        console.log('game');
        this.stage.backgroundColor = '#00DC00';

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.setBoundsToWorld();

        this.keys = this.input.keyboard.createCursorKeys();

        this.level = 0;

        this.player = new Player(this,'player');
        this.player.spawn();

        this.wallGroup = this.add.group();
        this.spawnWalls();

        this.boundsGroup = this.add.group();
        this.addProgressBounds();

        this.enemyGroup = this.add.group();

        this.fastEnemy = null;
        this.fastEnemyTimer = 0;
        this.fastEnemyAppear = 1000;

        this.bulletGroup = this.add.group();

        this.moveSwarm = false;
        this.shootSwarm = true;
        this.enemyShotTimer = 0;
        this.enemyShotBonus = 0;

        this.score = 0;
        this.scoreText = this.add.text(5,5,'Score: 0',
            {
                font: '16px Arial', 
                fill: '#000000', 
                align: 'center'
            });

        this.livesText = this.add.text(5,Invader.GAME_HEIGHT - 20,'Lives x' + this.player.lives,
            {
                font: '16px Arial', 
                fill: '#000000', 
                align: 'center'
            });

        this.gameMusic = this.add.audio('ingame');
        this.gameMusic.loop = true;
        setTimeout(() => {
            this.playMusic();
        }, 500);
        console.log('draw');
    },
    managePause: function() {
    },
    playMusic: function() {
        this.gameMusic.play();
    },
    update: function() {
        if(this.enemyGroup.total === 0) {
            if(this.level > 0) {
                this.updateScore(Invader.SWARM_SCORE_BONUS);
            }
            this.level += 1;
            this.spawnEnemies();
            this.enemyShotBonus = this.level * 2;

            if(this.level % 10 == 0) {
                this.respawnWalls();
            }
        }

        if(this.fastEnemyTimer === 0) {
            this.fastEnemyAppear = this.rnd.integerInRange(Invader.FARAWAY_MIN,Invader.FARAWAY_MAX);
        }
        this.fastEnemyTimer += 1;
        if(this.fastEnemyTimer >= this.fastEnemyAppear) {
            this.fastEnemyTimer = 0;
            this.fastEnemyAppear = -1;
            this.fastEnemy = new FastEnemy(this,'bad04');
            this.fastEnemy.x = Invader.GAME_WIDTH - 10;
            this.fastEnemy.y = 15;
            this.fastEnemy.spawn();
        }

        this.physics.arcade.overlap(this.enemyGroup, this.boundsGroup, () => { this.moveSwarm = true; });
            
        if(this.moveSwarm) {
            this.enemyGroup.forEach(
                function (enemy) {
                    enemy.reverseHorizontal();
                    enemy.progressVertical();
                }, this);
            this.moveSwarm = false;
        }


        let eShots = Invader.ENEMY_SHOT_LIMIT - this.enemyShotBonus < 25 ? 25 : Invader.ENEMY_SHOT_LIMIT - this.enemyShotBonus;

        if(this.enemyShotTimer >= eShots) {
            let enemyFire = null;
            do { 
                enemyFire = this.enemyGroup.getRandom();
            } while (!enemyFire || !enemyFire.alive);

            this.createBullet(enemyFire);
            this.enemyShotTimer = 0;
        } else {
            this.enemyShotTimer += 1;
        }

        this.physics.arcade.overlap(this.enemyGroup, this.wallGroup,
                function (enemy, wall) {
                    wall.weaken();
                    enemy.kill();
            });

        this.physics.arcade.overlap(this.wallGroup, this.bulletGroup,
                function (wall, bullet) {
                    if(bullet.source !== 'player') {
                        bullet.kill();
                        wall.weaken();
                    }
            });

        this.physics.arcade.overlap(this.enemyGroup, this.bulletGroup,
                (enemy, bullet) => {
                    if(bullet.source === 'player') {
                        bullet.kill();
                        enemy.kill();
                        this.updateScore(Invader.ENEMY_SCORE_BONUS);
                    }
                });

        this.physics.arcade.collide(this.player, this.bulletGroup,
                (player, bullet) => {
                    if(bullet.source !== 'player') {
                        bullet.kill();
                        player.health -= 1;
                        if(player.health <= 0) {
                            player.health = Invader.PLAYER_MAX_HEALTH;
                            this.updateLives(-1);
                            //reset playing area
                        }
                    }
                });

        if(this.fastEnemy) {
            this.physics.arcade.collide(this.fastEnemy, this.bulletGroup,
                    (fEnemy, bullet) => {
                        if(bullet.source === 'player') {
                            bullet.kill();
                            fEnemy.kill();
                            this.updateScore(Invader.FARAWAY_SCORE_BONUS);
                        }
                    });
        }

        this.physics.arcade.collide(this.player, this.enemyGroup,
                (player, enemy) => {
                    enemy.kill();
                    player.health -= 1;
                    if(player.health <= 0) {
                        player.health = Invader.PLAYER_MAX_HEALTH;
                        this.updateLives(-1);
                        //reset playing area
                    }
                });

        if(!this.player.alive) {
            this.gameMusic.destroy();
            this.state.states['GameOver'].endScore = this.score;
            this.state.start('GameOver'); 
        }
    },
    addProgressBounds: function() {
        let leftBound = new Bounds(this,'bounds',false);
        leftBound.spawn();
        let rightBound = new Bounds(this,'bounds',true);
        rightBound.spawn();
        this.boundsGroup.add(leftBound);
        this.boundsGroup.add(rightBound);
    },
    spawnWalls: function() {
        let w0 = new Wall(this,'wall',0);
        let w1 = new Wall(this,'wall',1);
        let w2 = new Wall(this,'wall',2);

        w0.spawn();
        w1.spawn();
        w2.spawn();

        this.wallGroup.add(w0);
        this.wallGroup.add(w1);
        this.wallGroup.add(w2);
    },
    respawnWalls: function() {
        this.wallGroup.clear(true);
        this.spawnWalls();
    },
    spawnEnemies: function() {
        let e1chance = {
            label: 'bad01',
            num: 0
        };
        let e2chance = {
            label: 'bad02',
            num: 0
        };
        let e3chance = {
            label: 'bad03',
            num: 0
        };

        if(this.level < 3) {
            e1chance.num = 100;
            e2chance.num = 15;
            e3chance.num = 5;
        } else if(this.level < 6) {
            e1chance.num = 100;
            e2chance.num = 30;
            e3chance.num = 10;
        } else if(this.level < 10) {
            e1chance.num = 100;
            e2chance.num = 65;
            e3chance.num = 40;
        } else if(this.level < 15) {
            e1chance.num = 25;
            e2chance.num = 100;
            e3chance.num = 50;
        } else {
            e1chance.num = 10;
            e2chance.num = 50;
            e3chance.num = 100;
        }

        let eChances = [e1chance, e2chance, e3chance];
        eChances.sort(function (a,b) {
            return a.num-b.num;
        });
        
        let formations = ['box', 'rect', 'echelon', 'pyramid', 'ring', 'pillars', 'crown', 'across', 'disc'];

        /*
         * key = xxxxxx
         *        xxxx
         *       xxxxxx
         *       x    x
         *       xxxxxx
         *
         * shell = x       x
         *         x x   x x
         *         x xxxxx x
         *         x x   x x
         *         xxxxxxxxx
         */

        let nEnemy;
        let enemySel;

        let shape = Phaser.ArrayUtils.getRandomItem(formations);
        let alter = true;

        let rf = this.determineShapeLines(shape);
        let ranks = rf[0];
        let files = rf[1];

        for(let i = 0; i < files; i++) {
            for(let j = 0; j < ranks; j++) {
                if(shape === 'ring' && (i !== 0 && j !== 0 && i !== (files - 1) && j !== (ranks - 1))) {
                        continue;
                }
                if(shape === 'pillars' || shape === 'crown') {
                    if(i % 2 !== 0) {
                        if(shape === 'crown' && j !== ranks - 1) {
                            continue;
                        }
                        if(shape === 'pillars') {
                            continue;
                        }
                    }
                }
                if(shape === 'across' && i !== j && j !== (files - 1) - i) {
                    continue;
                }
                if(shape === 'disc') {
                    if(j % 2 !== 0) {
                        if(i !== 0 && i !== ranks) {
                            continue;
                        }
                    }
                }

                enemySel = 1 + Math.random() * 100;
                //console.log("Rand: " + enemySel + "i,j" + i + " " + j);
                if(enemySel < eChances[0]) {
                    //console.log(eChances[0].label);
                    nEnemy = new Enemy(this,eChances[0].label);
                } else if(enemySel < eChances[1]) {
                    //console.log(eChances[1].label);
                    nEnemy = new Enemy(this,eChances[1].label);
                } else {
                    //console.log(eChances[2].label);
                    nEnemy = new Enemy(this,eChances[2].label);
                    //this.enemyGroup.add(this.add.sprite(0,50,'bad04'));
                }

                let dx;
                let dy;
                switch (shape) {
                    case 'box':
                        dx = 40 + 40 * i;
                        dy = 40 + 40 * j;
                        break;
                    case 'rect':
                    case 'pillars':
                    case 'crown':
                    case 'across':
                    case 'disc':
                        dx = 40 + 60 * i;
                        dy = 40 + 60 * j;
                        break;
                    case 'echelon':
                        dx = 40 + 60 * i + (j * 40);
                        dy = 40 + 60 * j;
                        break;
                    case 'pyramid':
                    case 'ring':
                        dx = 40 + 80 * i;
                        dy = 40 + 80 * j;
                        break;
                    default:
                        dx = 0;
                        dy = 0;
                        break;
                }

                nEnemy.x = dx;
                nEnemy.y = dy;
                nEnemy.spawn();
                this.enemyGroup.add(nEnemy);
            }

            if(shape === 'pyramid') {
                ranks -= 1;
            }
        }
    },
    createBullet: function(whoFire) {
        let bullet = new Bullet(this,'bullet',whoFire);
        bullet.spawn();
        this.bulletGroup.add(bullet);
    },
    updateScore: function(nScore) {
        this.score += nScore;
        this.scoreText.setText('Score: ' + this.score);
        if(this.score > 0 && this.score % 5000 === 0) {
            this.updateLives(1);
        }
    },
    updateLives: function(nLives) {
        this.player.lives += nLives;
        this.livesText.setText('Lives x' + this.player.lives);
        if(this.player.lives <= 0) {
            this.player.kill();
        }
    },
    determineShapeLines: function(shape) {
        let ranks;
        let files;

        switch (shape) {
            case 'box':
                ranks = 5;
                files = 5;
                break;
            case 'rect':
                ranks = 3;
                files = 8;
                break;
            case 'echelon':
            case 'ring':
                ranks = 4;
                files = 6;
                break;
            case 'pyramid':
                ranks = 4;
                files = 5;
                break;
            case 'pillars':
                ranks = 4;
                files = 8;
                break;
            case 'crown':
                ranks = 4;
                files = 7;
                break;
            case 'across':
                ranks = 4;
                files = 4;
                break;
            case 'disc':
                ranks = 5;
                files = 6;
                break;
            default:
                ranks = files = 0;
                break;
        }
        
        return [ranks,files];
    }
};
