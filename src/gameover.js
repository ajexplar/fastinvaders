Invader.GameOver = function(game) {
    this.gameoverText = null;
    this.scoreText = null;
    this.endScore = 0;
    this.restartGameBtn = null;
};

Invader.GameOver.prototype = {
    create: function() {
        console.log('game-over');
        this.stage.backgroundColor = '#DCDCDC';
        this.gameoverText = this.add.text(Invader.GAME_WIDTH / 2 - 140,Invader.GAME_HEIGHT / 2 - 75, 'Game Over',
            {
                font: '48px Rockwell', 
                fill: '#000000', 
                align: 'center'
            });

        this.scoreText = this.add.text(Invader.GAME_WIDTH / 2 - 110,Invader.GAME_HEIGHT / 2 - 15, 'Final Score was ' + this.endScore,
            {
                font: '24px Rockwell', 
                fill: '#000000', 
                align: 'center'
            });

        this.restartGameBtn = this.add.button(Invader.GAME_WIDTH / 2, Invader.GAME_HEIGHT / 2 + 90, 'restartBtn', this.restartGame, this, 0, 0, 0); 
        this.restartGameBtn.anchor.set(0.5);
    },
    restartGame: function() {
        this.state.start('Game'); 
    }
};
