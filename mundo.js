
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
        for(let c=0;c<19;c++){
          this.load.image('tile'+(c+1),'./img/tile'+(c+1)+'.png');
        }
      }
    }

    start(){
      let e = this.escena;
      this.escena.create = function(){
        let tile_den = [];
        for(let c=0;c<19;c++){
          tile_den[c] = { 'den':'tile'+(c+1) };
        }
        let mapConfig  = {
          "tiles_x":128,
          "tiles_y":128,
          "tiles_z":1,
        };
        let GM         = new GeneradorMapa(mapConfig);
        GM.generarTerreno();
        this.isometric = new IsometricWorld(e,'tiles',GM.getMapa(),tile_den);
      }

      this.escena.update = function(){
        let vel_desp = 1.235;
        let cursors = this.input.keyboard.createCursorKeys();
          if (cursors.left.isDown){
            this.isometric.cam_px -= vel_desp;
            this.isometric.update();
          }

          if (cursors.right.isDown){
            this.isometric.cam_px += vel_desp;
            this.isometric.update();
          }

          if (cursors.up.isDown ){
            this.isometric.cam_py -= vel_desp;
            this.isometric.update();
          }

          if (cursors.down.isDown ){
            this.isometric.cam_py += vel_desp;
            this.isometric.update();
          }
      }

      this.game = new Phaser.Game(this.config);
    }
}
