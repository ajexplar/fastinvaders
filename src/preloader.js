Invader.Preloader = function(game) {
    Invader.GAME_WIDTH = 640;
    Invader.GAME_HEIGHT = 480;
    Invader.keylist = null;
};

Invader.Preloader.prototype = {
    preload: function() {
        Invader.keylist = this.game.input.keyboard.addKeys({
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            space: Phaser.Keyboard.SPACEBAR
        });
        this.input.keyboard.addKeyCapture(Invader.keylist)

        this.stage.backgroundColor = '#DCDCDC';

        //this.preloadBar = this.add.sprite((Invader.GAME_WIDTH-150)/2, (Invader.GAME_HEIGHT-50)/2, 'preloadBar');
        //this.load.setPreloadSprite(this.preloadBar);

        this.load.image('startBtn', 'images/play-btn.png');
        this.load.image('quitBtn', 'images/quit-btn.png');
        this.load.image('restartBtn', 'images/replay-btn.png');
        
        this.load.image('player', 'images/player.png');
        this.load.image('wall', 'images/wall.png');
        this.load.image('bounds', 'images/bounds.png');
        this.load.image('bullet', 'images/bullet.png');
        this.load.image('bad01', 'images/baddie01.png');
        this.load.image('bad02', 'images/baddie02.png');
        this.load.image('bad03', 'images/baddie03.png');
        this.load.image('bad04', 'images/baddie04.png');

        this.load.audio('title', ['audio/si-title.mp3', 'audio/si-title.ogg']);
        this.load.audio('ingame', ['audio/si-game.mp3', 'audio/si-game.ogg']);
    },
    create: function() {
        console.log('preload');
        this.state.start('MainMenu');
    }
};
