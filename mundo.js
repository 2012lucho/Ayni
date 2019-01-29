
class Mundo{
    constructor(config){
      this.name    = 'Mundo';
      this.config  = config;
      this.escena  = new Phaser.Scene(this.name);
      config.scene = this.escena;
      this.mapa    = [];
      this.preload();
    }

    preload(){
      this.escena.preload = function() {
        for(let c=0;c<19;c++){
          this.load.image('tile'+(c+1),'./img/tile'+(c+1)+'.png');
        }
        this.load.image('point','./img/point.png');
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
        this.isometric = new IsometricWorld(e,'tiles', GM.getSubMapa(0,0,128,128), tile_den);

        this.prota = new Jugador({ 'escena':e, 'vel_desp':1.235, 'mundo':this.isometric });
        this.prota.z = 1;
        this.prota.x = 3;
        this.prota.y = 3;
      }

      this.escena.update = function(){
        this.prota.update(this);
      }

      this.game = new Phaser.Game(this.config);
    }
}
