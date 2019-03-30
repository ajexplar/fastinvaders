var Invader = {};

Invader.Boot = function(game) { };

Invader.Boot.prototype = {
    preload: function() {
        //this.load.image('preloadBackground', 'images/inv_bg_0.png');
        //this.load.image('preloadBar', 'images/inv_loadbar_0.png');
    },
    create: function() {
        console.log('boot');
        // only need 1 touch input
        this.input.maxPointers = 1;
        // fits game to screen and keeps ratio
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // same space on all sides of canvas
        this.scalePageAlignHorizontally = true;
        this.scalePageAlignVertically = true;
        // activates scaling
        //this.scale.setScreenSize(true);
        this.scale.refresh();
        this.state.start('Preloader');
    }
};
