Invader.MainMenu = function(game) {
    this.titleText = null;
    this.startGameBtn = null;
    this.quitGameBtn = null;
    this.titleMusic = null;
};
Invader.MainMenu.prototype = {
    create: function() {
        console.log('main-menu');
        this.titleText = this.add.text(Invader.GAME_WIDTH / 2 - 160,Invader.GAME_HEIGHT / 2 - 75, 'FestInvaders!',
            {
                font: '48px Rockwell', 
                fill: '#000000', 
                align: 'center'
            });

        this.startGameBtn = this.add.button(Invader.GAME_WIDTH / 2, Invader.GAME_HEIGHT / 2 + 90, 'startBtn', this.startGame, this, 0, 0, 0); 
        //this.quitGameBtn = this.add.button(Invader.GAME_WIDTH / 2 + 25, Invader.GAME_HEIGHT / 2 + 130, 'quitBtn', this.quitGame, this, 0, 0, 0); 
        this.startGameBtn.anchor.set(0.5);
        //this.quitGameBtn.anchor.set(0.5);
        
        this.titleMusic = this.add.audio('title');
        this.titleMusic.loop = true;
        setTimeout(() => {
            this.playMusic();
        }, 500);
    },
    playMusic: function() {
        this.titleMusic.play();
    },
    startGame: function() {
        this.titleMusic.destroy();
        this.state.start('Game');
    },
    quitGame: function() {
        this.destroy();
    }
};
