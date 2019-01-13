
class Mundo{
    constructor(config){
      this.name    = 'Mundo';
      this.config  = config;
      this.escena  = new Phaser.Scene(this.name);
      config.scene = this.escena;

      this.preload();
    }

    preload(){
      this.escena.preload = function() {
        for(let c=0;c<16;c++){
          this.load.image('tile'+(c+1),'./img/tile'+(c+1)+'.png');
        }
      }
    }

    start(){
      let e = this.escena;
      this.escena.create = function(){
        let tile_den = [];
        for(let c=0;c<16;c++){
          tile_den[c] = 'tile'+(c+1);
        }
        this.isometric = new IsometricWorld(e,'tiles',map,tile_den);
      }

      this.escena.update = function(){
        let cursors = this.input.keyboard.createCursorKeys();
          if (cursors.left.isDown){
            this.isometric.cam_px -= 1.2;
            this.isometric.update();
          }

          if (cursors.right.isDown){
            this.isometric.cam_px += 1.2;
            this.isometric.update();
          }

          if (cursors.up.isDown ){
            this.isometric.cam_py -= 1.2;
            this.isometric.update();
          }

          if (cursors.down.isDown ){
            this.isometric.cam_py += 1.2;
            this.isometric.update();
          }
      }

      this.game = new Phaser.Game(this.config);
    }
}
