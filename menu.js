
class Menu{
    constructor(config){
      this.name    = 'Menu';
      this.config  = config;
      this.escena  = new Phaser.Scene(this.name);
      config.scene = this.escena;
      this.preload();
    }

    preload(){
      this.escena.preload = function() {
        this.load.image('background','./img/BG_Menu.png');
      }
    }

    start(){
      this.escena.create = function(){
        let s = this.add.sprite(0,0,'background');
        s.setOrigin(0,0);
      }

      this.game = new Phaser.Game(this.config);
    }
}
